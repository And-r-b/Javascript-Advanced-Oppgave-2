// HTML elements:
const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const listContainer = document.querySelector("#list-container");

let filters = { showCompleted: false}

let tasks = [];

// local storage
const saveTaskToStorage = () => localStorage.setItem('tasks', JSON.stringify(tasks))
const saveFiltersStorage = () => localStorage.setItem('filters', JSON.stringify(filters))


// Event Listner after pressing submit

taskForm.addEventListener("submit", addTodoHandler);
  

function addTodoHandler (e) {   
    e.preventDefault();
    const formData = new FormData(taskForm);
    const userInput = formData.get('task-input');
    taskInput.value = "";

    if (!userInput) {
        return alert("Todo tekst kan ikke være tom.");
    } else if (userInput.lenght < 3) {
        return alert("Todo tekst kan ikke være under 3 bokstaver.");
    }

    tasks.push({
        timestamp: new Date(), 
        description: userInput,
        completed: false
    })
    saveTaskToStorage()
    renderPage();
}

function completedTaskInput(task) {
    const inputElement = document.createElement('input');
    inputElement.type = "checkbox";
    inputElement.checked = task.completed;

    inputElement.addEventListener('change', (e) => {
        task.completed = e.target.checked;
        saveTaskToStorage();
        renderPage();
    })
    return inputElement;
}

function buildPage(taskArr) {
    listContainer.innerHTML = "";
    taskArr.forEach(task => {
        const taskContainer = document.createElement("div");
        taskContainer.classList.add('task-container');
        task.completed ? taskContainer.classList.add('completed') : taskContainer.classList.remove('completed');
        
        const timeStampElement = document.createElement('p');
        timeStampElement.classList.add('datetime');
        timeStampElement.textContent = task.timestamp.toLocaleString('en-UK');
        
        const descriptionElement = document.createElement('p');
        descriptionElement.classList.add('description');
        descriptionElement.textContent = task.description

        const completeInput = completedTaskInput(task)
        
        // append elements
        taskContainer.append(
            timeStampElement,
            descriptionElement,
            completeInput
        );
        // prepend taskContainer
        listContainer.prepend(taskContainer) 
    })
}

function filterArray(taskArr) {
    return taskArr.filter((task) => (filters.showCompleted || !task.completed))
}

function renderPage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
    const storedFilters = localStorage.getItem('filters');
    if (storedFilters) {
        filters = JSON.parse(storedFilters);
    }

    buildPage(filterArray(tasks));
}

renderPage();