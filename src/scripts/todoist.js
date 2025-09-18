export async function startTodoistModule() {
    const dom = catchTodoistDomElements()
    const data = await getTodoistTasks()

    fillTodoistDomElements(data, dom)
}

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

function catchTodoistDomElements() {
    return {
        container: document.querySelector("todoist-tasks")
    }
}

function fillTodoistDomElements(data, dom) {
    console.log(data.results)
    for (let task of data.results) {
        
        let taskContainer = document.createElement("todoist-task")

        dom.container.append(taskContainer)
        taskContainer.innerHTML = `
            <todoist-checkbox></todoist-checkbox>
            <span class="todoist-task-label">${task.content}</span>
            <span class="todoist-task-due">${task.due.date}</span>
        `
    }
}