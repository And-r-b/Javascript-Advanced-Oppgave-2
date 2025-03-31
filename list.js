// HTML elements:
const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const listContainer = document.querySelector("#list-container");
const taskStats = document.querySelector("#task-stats");
const resetButton = document.querySelector("#reset-button");

// Sidebar Elements
const sidebar = document.getElementById("sidebar");
const hamburger = document.getElementById("hamburger");
const closeBtn = document.getElementById("close-btn");
const userForm = document.getElementById("user-form");
const usernameInput = document.getElementById("username");
const trainingTypeInput = document.getElementById("training-type");
const userInfo = document.getElementById("user-info");
const displayUsername = document.getElementById("display-username");
const displayTrainingType = document.getElementById("display-training-type");
const resetUserBtn = document.getElementById("reset-user");

let filters = { showCompleted: false };
let tasks = [];

// Local storage functions
const saveTaskToStorage = () => localStorage.setItem("tasks", JSON.stringify(tasks));
const saveFiltersStorage = () => localStorage.setItem("filters", JSON.stringify(filters));

const saveUserDataToStorage = () => {
    const username = usernameInput.value;
    const trainingType = trainingTypeInput.value;
    localStorage.setItem("username", username);
    localStorage.setItem("trainingType", trainingType);
};

// Event Listeners for Task Form and Reset Button
taskForm.addEventListener("submit", addTodoHandler);
resetButton.addEventListener("click", resetPage);

// Event Listeners for Sidebar
hamburger.addEventListener("click", () => {
    sidebar.style.left = "0"; // Open sidebar
});

closeBtn.addEventListener("click", () => {
    sidebar.style.left = "-300px"; // Close sidebar
});

// Save user data and hide the input form
userForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Save username and training type to localStorage
    saveUserDataToStorage();

    // Display the saved info
    displayUsername.textContent = `Username: ${usernameInput.value}`;
    displayTrainingType.textContent = `Preferred Training: ${trainingTypeInput.value}`;

    // Hide the form and show the user info
    userForm.style.display = "none";
    userInfo.style.display = "block";

    // Clear the input fields
    usernameInput.value = "";
    trainingTypeInput.value = "";

    // Close the sidebar after saving
    sidebar.style.left = "-300px";
});

// Reset user data and clear from localStorage
resetUserBtn.addEventListener("click", () => {
    // Remove user info from localStorage
    localStorage.removeItem("username");
    localStorage.removeItem("trainingType");

    // Clear displayed user info
    displayUsername.textContent = "";
    displayTrainingType.textContent = "";

    // Show the form and hide the user info
    userForm.style.display = "block";
    userInfo.style.display = "none";
});

// Load saved user data on page load (if available)
window.addEventListener("load", () => {
    const savedUsername = localStorage.getItem("username");
    const savedTrainingType = localStorage.getItem("trainingType");

    if (savedUsername && savedTrainingType) {
        // If data exists in localStorage, display it
        displayUsername.textContent = `Username: ${savedUsername}`;
        displayTrainingType.textContent = `Preferred Training: ${savedTrainingType}`;
        
        // Hide the form and show the user info
        userForm.style.display = "none";
        userInfo.style.display = "block";
    }
});

// Add task to the task array
function addTodoHandler(e) {
    e.preventDefault();
    const formData = new FormData(taskForm);
    const userInput = formData.get("task-input");
    taskInput.value = "";

    if (!userInput) {
        return alert("Tekst kan ikke være tom.");
    } else if (userInput.length < 3) {
        return alert("Tekst kan ikke være under 3 bokstaver.");
    }

    tasks.push({
        timestamp: new Date().toISOString(),
        description: userInput,
        completed: false
    });
    saveTaskToStorage();
    renderPage();
}

function completedTaskInput(task) {
    const inputElement = document.createElement("input");
    inputElement.type = "checkbox";
    inputElement.checked = task.completed;

    inputElement.addEventListener("change", (e) => {
        const taskIndex = tasks.findIndex(t => t.timestamp === task.timestamp);
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = e.target.checked;
        }
        saveTaskToStorage();
        renderPage();
    });

    return inputElement;
}

function buildPage(taskArr) {
    listContainer.innerHTML = "";

    taskArr
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort newest first
        .map(({ timestamp, description, completed }) => {
            const taskContainer = document.createElement("div");
            taskContainer.classList.add("task-container");
            if (completed) taskContainer.classList.add("completed");
            Object.assign(taskContainer.style, {
                backgroundColor: "rgb(0, 255, 30)",
                borderRadius: "10px",
                boxShadow: "5px 5px"
            });

            const timeStampElement = document.createElement("p");
            timeStampElement.classList.add("datetime");
            timeStampElement.textContent = new Date(timestamp).toLocaleString("en-UK");

            const descriptionElement = document.createElement("p");
            descriptionElement.classList.add("description");
            descriptionElement.textContent = description;

            const completeInput = completedTaskInput({ timestamp, description, completed });

            taskContainer.append(timeStampElement, descriptionElement, completeInput);
            listContainer.prepend(taskContainer);
        });
}

function filterArray(taskArr) {
    return taskArr.filter((task) => filters.showCompleted || !task.completed);
}

function getTaskStats() {
    const stats = tasks.reduce(
        (acc, task) => {
            acc.total++;
            if (task.completed) acc.completed++;
            return acc;
        },
        { total: 0, completed: 0 }
    );

    taskStats.textContent = `Fullført: ${stats.completed} / Totalt: ${stats.total}`;
}

function resetPage() {
    tasks = [];
    localStorage.removeItem("tasks");
    localStorage.removeItem("filters");
    renderPage();
}

function renderPage() {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
    const storedFilters = localStorage.getItem("filters");
    if (storedFilters) {
        filters = JSON.parse(storedFilters);
    }

    buildPage(filterArray(tasks));
    getTaskStats();
    const username = localStorage.getItem("username");
    const trainingType = localStorage.getItem("trainingType");
    if (username && trainingType) {
        console.log(`User: ${username}, Training Type: ${trainingType}`);
    }
}

renderPage();
