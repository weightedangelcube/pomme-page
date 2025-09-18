let checkboxList

/**
 * Main exported module function that triggers the API fetch, collects DOM elements, and fills DOM elements.
 * @async
 * @returns {void} Nothing
 */
export async function startTodoistModule() {
    const dom = catchTodoistDomElements()
    const data = await getTodoistTasks()
    

    fillTodoistDomElements(data, dom)
    addCheckboxListener()
}

/**
 * GET data from the Todoist API. Fetches tasks due in the next five days
 * @async
 * @returns {Promise} Promise object
 */
async function getTodoistTasks() {
    const url = 'https://api.todoist.com/api/v1/tasks/filter?query=5+days'
    const apiKey = import.meta.env.PUBLIC_TODOIST_KEY
    const request = new Request(url, {
        method: "GET",
        headers: new Headers({
            "Authorization": `Bearer ${apiKey}`
        })
    })
    const response = await fetch(request)
    if (!response.ok) {
        // TODO: display error on page somehow
        throw new Error(`An error has occured: ${response.status} ${response.statusText}`)
    }
    return response.json()
}

/**
 * Catch DOM elements to be later filled with data
 * @returns {Object} DOM elements contained in an object
 */
function catchTodoistDomElements() {
    return {
        container: document.querySelector("todoist-tasks")
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

    console.log(data.results)
    for (let task of data.results) {
        let dueDate = new Date(task.due.date)
            .toLocaleDateString(import.meta.env.PUBLIC_LOCALE, {year: 'numeric', month: 'numeric', day: 'numeric'})

        let taskContainer = document.createElement("todoist-task")

        dom.container.append(taskContainer)
        taskContainer.innerHTML = `
            <todoist-checkbox></todoist-checkbox>
            <span class="todoist-task-label">${task.content}</span>
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
        checkbox.addEventListener('click', function () {
            toggleTaskChecked(this)
        })
    }
}

function toggleTaskChecked(element) {
    element.innerHTML = (element.innerHTML === "") ? "" : ""
}