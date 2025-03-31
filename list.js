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
const trainingOptionsContainer = document.getElementById("training-options-container");

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

const loadUserDataFromStorage = () => {
    const savedUsername = localStorage.getItem("username");
    const savedTrainingType = localStorage.getItem("trainingType");

    if (savedUsername && savedTrainingType) {
        // If saved data exists, display it
        displayUsername.textContent = `Brukernavn: ${savedUsername}`;
        displayTrainingType.textContent = `Foretrukket Trening: ${savedTrainingType}`;

        // Ensure the training type is displayed
        displayTrainingType.style.display = "block";
        
        // Hide the form and show the user info
        userForm.style.display = "none";
        userInfo.style.display = "block";

        // Show training options based on saved training type
        showTrainingOptions(savedTrainingType); // Show options immediately after load
    }
};

// Training options
const trainingOptions = {
    cardio: ["Løping", "Sykling", "Svømming"],
    strength: ["Vektløfting", "Kroppsvektøvelser", "Motstandsbåndstrening"],
    yoga: ["Hatha Yoga", "Vinyasa Yoga", "Ashtanga Yoga", "Restorativ Yoga"],
    pilates: ["Mat Pilates", "Reformer Pilates"],
    other: ["Egendefinert trening"]
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
    displayUsername.textContent = `Brukernavn: ${usernameInput.value}`;
    displayTrainingType.textContent = `Foretrukket Trening: ${trainingTypeInput.value}`;

    displayTrainingType.style.display = "block";

    // Hide the form and show the user info
    userForm.style.display = "none";
    userInfo.style.display = "block";

    // Show training options dynamically after saving
    showTrainingOptions(trainingTypeInput.value);

    // Close the sidebar after saving
    sidebar.style.left = "-300px";

    // Clear the input fields
    usernameInput.value = "";
    trainingTypeInput.value = "";
});

document.getElementById("preferred-training-button").addEventListener("click", () => {
    // Show a selector to change the training type
    const newTrainingType = prompt("Velg ny trenings type (kondisjon, styrke, yoga, pilates, annet):");

    // Update the training type in localStorage
    localStorage.setItem("trainingType", newTrainingType);
    
    // Update the displayed training type
    displayTrainingType.textContent = `Foretrukket Trening: ${newTrainingType}`;
    
    // Show new training options based on the new type
    showTrainingOptions(newTrainingType);
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
    loadUserDataFromStorage();
});

// Show training options based on selected training type
function showTrainingOptions(trainingType) {
    // Clear current options
    trainingOptionsContainer.innerHTML = "";

    // Reference the GIF container and image
    const gifContainer = document.getElementById("gif-container");
    const trainingGif = document.getElementById("training-gif");

    // Define GIF paths for each training type
    const gifSources = {
        cardio: "cardio.gif",
        strength: "strength.gif",
        yoga: "yoga.gif",
        pilates: "pilates.gif",
        other: "other.gif"
    };

    // Update the GIF if a matching type is selected
    if (gifSources[trainingType]) {
        trainingGif.src = gifSources[trainingType];
        gifContainer.style.display = "block";  // Show the GIF
    } else {
        gifContainer.style.display = "none";  // Hide the GIF if no match
    }

    // Get options for the selected training type
    const options = trainingOptions[trainingType] || [];

    // Create buttons for the training options
    options.forEach(option => {
        const optionElement = document.createElement("button");
        optionElement.textContent = option;
        optionElement.classList.add("training-option");

        // Add click event to add the option to the task description
        optionElement.addEventListener("click", () => {
            taskInput.value = `${option} - `;
        });

        trainingOptionsContainer.appendChild(optionElement);
    });
}

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
            timeStampElement.textContent = new Date(timestamp).toLocaleString("nb-NO");

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
        console.log(`Bruker: ${username}, Treningsvalg: ${trainingType}`);
    }
}

renderPage();
