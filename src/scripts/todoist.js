let checkboxList

/**
 * Main exported module function that triggers the API fetch, collects DOM elements, and fills DOM elements.
 * @async
 * @returns {void} Nothing
 */
export async function startTodoistModule() {
	const dom = catchTodoistDomElements()
	const data = await getTodoistTasks(dom.filter)

	fillTodoistDomElements(data, dom)
	addCheckboxListener()
}

/**
 * GET data from the Todoist API. Fetches tasks from a filter passed in props
 * @async
 * @returns {Promise} Promise object
 */
async function getTodoistTasks(filter) {
	const url = "https://api.todoist.com/api/v1/tasks/filter"
	var params

	if (filter) {		
		params = new URLSearchParams([
			["query", `${filter}`]
		])
	} else {
		displayErrorOnPage(`Filter can't be null!`)
		throw new Error(`Filter can't be null!`)
	}

	const apiKey = import.meta.env.PUBLIC_TODOIST_TOKEN
	const request = new Request(`${url}?${params}`, {
		method: "GET",
		headers: new Headers({
			Authorization: `Bearer ${apiKey}`,
		}),
	})
	const response = await fetch(request)
	if (!response.ok) {
		displayErrorOnPage(`${response.status} ${response.statusText}`)
		throw new Error(`API error ${response.status} ${response.statusText}`)
	}
	return response.json()
}


/**
 * Displays an error on the page.
 * @param {string} error The error message to display. 
 * @returns {void} Nothing
 */
function displayErrorOnPage(error) {
	const errorContainer = document.querySelector("todoist-error-container")
	const errorText = document.querySelector("todoist-error-container > p")
	errorText.append(error)
	errorContainer.style.display = "flex"
}

/**
 * Catch DOM elements to be later filled with data
 * @returns {Object} DOM elements contained in an object
 */
function catchTodoistDomElements() {
	return {
		filter: document.querySelector("todoist").getAttribute("filter"),
		container: document.querySelector("todoist-tasks"),
	}
}

/**
 * Fill targeted DOM elements with Todoist API data
 * @param {Object} data Data from the Todoist API
 * @param {Object} dom DOM elements to be filled
 * @returns {void} Nothing
 */
function fillTodoistDomElements(data, dom) {
	data.results.sort((a, b) => {
		const dateA = new Date(a.due.date).valueOf()
		const dateB = new Date(b.due.date).valueOf()

		return dateA - dateB
	})

	for (let task of data.results) {
		let dueDate = new Date(task.due.date).toLocaleDateString(
			import.meta.env.PUBLIC_LOCALE,
			{ year: "numeric", month: "numeric", day: "numeric" }
		)

		let taskContainer = document.createElement("todoist-task")
		taskContainer.id = `todoist-task-${task.id}`

		dom.container.append(taskContainer)
		taskContainer.innerHTML = `
            <todoist-checkbox></todoist-checkbox>
            <span class="todoist-task-label" title="${task.content}">${task.content} ${task.labels.toString() ? "@" + task.labels.toString() : ""}</span>
            <span class="todoist-task-due">${dueDate}</span>
        `
	}
}

/**
 * Adds a listener for checkbox clicks.
 * @returns {void} Nothing
 */
function addCheckboxListener() {
	checkboxList = document.querySelectorAll("todoist-checkbox")

	for (const checkbox of checkboxList) {
		checkbox.addEventListener("click", async function () {
			await toggleTaskChecked(this)
		})
	}
}

/**
 * Toggles a task as checked, and syncs its state to the Todoist API.
 * @param {Element} checkbox The checkbox that was toggled 
 */
async function toggleTaskChecked(checkbox) {
	const taskID = checkbox.parentNode.id.replace("todoist-task-", "")

	checkbox.innerHTML = checkbox.innerHTML === "" ? "" : ""
	checkbox.nextElementSibling.classList.add("todoist-task-strikethrough")

	// sleep one second while we wait for css animation
	await new Promise((r) => setTimeout(r, 1000))

	checkbox.parentElement.style.display = "none"

	// slide all the tasks up
	document.querySelectorAll("todoist-task").forEach((task) => {
		task.classList.add("todoist-task-slide-up")
	})

	// wait for animation to finish
	await new Promise((r) => setTimeout(r, 300))

	// remove checked task
	document.getElementById(`todoist-task-${taskID}`).remove()

	// remove animation class from tasks
	document.querySelectorAll("todoist-task").forEach((task) => {
		task.classList.remove("todoist-task-slide-up")
	})

	const commands = `[{
        "type": "item_complete",
        "uuid": "${self.crypto.randomUUID()}",
        "args": {
            "id": "${taskID}",
            "date_completed": "${new Date().toISOString()}"
        }
    }]`
	const url = `https://api.todoist.com/api/v1/sync?commands=${commands}`
	const apiKey = import.meta.env.PUBLIC_TODOIST_TOKEN
	const request = new Request(url, {
		method: "POST",
		headers: new Headers({
			Authorization: `Bearer ${apiKey}`,
		}),
	})
	const response = await fetch(request)
	if (!response.ok) {
		displayErrorOnPage(`${response.status} ${response.statusText}`)
		throw new Error(
			`An error has occured: ${response.status} ${response.statusText}`
		)
	}
}
