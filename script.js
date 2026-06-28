const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");

const filterButtons = document.querySelectorAll(".filter-btn");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

searchInput.addEventListener("input", displayTasks);

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active"));

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        displayTasks();

    });

});

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    const task = {

        id: Date.now(),

        text: text,

        completed: false,

        createdAt: new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
}),

        dueDate: taskDate.value

    };

    tasks.push(task);

    taskInput.value = "";
    taskDate.value = "";

    saveTasks();

    displayTasks();

}

function displayTasks() {

    taskList.innerHTML = "";

    let filteredTasks = [...tasks];

    const keyword = searchInput.value.toLowerCase();

    filteredTasks = filteredTasks.filter(task =>
        task.text.toLowerCase().includes(keyword)
    );

    if (currentFilter === "completed") {

        filteredTasks =
            filteredTasks.filter(task => task.completed);

    }

    if (currentFilter === "pending") {

        filteredTasks =
            filteredTasks.filter(task => !task.completed);

    }

    filteredTasks.sort((a, b) => {

        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;

        return new Date(a.dueDate) - new Date(b.dueDate);

    });

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className =
            task.completed ? "task completed" : "task";

        let dueHTML = "";

        let remainingHTML = "";

        if (task.dueDate) {

            const due = new Date(task.dueDate);

            const now = new Date();

            const diff = due - now;

            const days =
                Math.floor(diff / (1000 * 60 * 60 * 24));

            const hours =
                Math.floor((diff % (1000 * 60 * 60 * 24)) /
                    (1000 * 60 * 60));

            dueHTML = `
                <div style="font-size:13px;color:#555;">
                    📅 Due: ${due.toLocaleString()}
                </div>
            `;

            if (!task.completed) {

                if (diff < 0) {

                    remainingHTML =
                        `<div style="color:red;font-size:13px;">
                            🔴 Overdue
                        </div>`;

                } else {

                    remainingHTML =
                        `<div style="color:green;font-size:13px;">
                            ⏰ ${days} Day(s) ${hours} Hour(s) Left
                        </div>`;

                }

            }

        }

        li.innerHTML = `
            <div class="task-left">

                <input
                    type="checkbox"
                    ${task.completed ? "checked" : ""}>

                <div>

                    <span>${task.text}</span>

                    ${dueHTML}

                    <div style="font-size:13px;color:gray;">
                        🕒 Created:
                        ${task.createdAt}
                    </div>

                    ${remainingHTML}

                </div>

            </div>

            <div class="actions">

                <button class="edit-btn">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button class="delete-btn">
                    <i class="fa-solid fa-trash"></i>
                </button>

            </div>
        `;        
        li.querySelector("input").addEventListener("change", () => {
            toggleTask(task.id);
        });

        li.querySelector(".edit-btn").addEventListener("click", () => {
            editTask(task.id);
        });

        li.querySelector(".delete-btn").addEventListener("click", () => {
            deleteTask(task.id);
        });

        taskList.appendChild(li);

    });

    updateStats();

}

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;

    });

    saveTasks();

    displayTasks();

}

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    displayTasks();

}

function editTask(id) {

    const task = tasks.find(task => task.id === id);

    const updatedTask = prompt("Edit Task", task.text);

    if (updatedTask === null) return;

    if (updatedTask.trim() === "") return;

    task.text = updatedTask.trim();

    saveTasks();

    displayTasks();

}

function updateStats() {

    totalTasks.textContent = tasks.length;

    completedTasks.textContent =
        tasks.filter(task => task.completed).length;

    pendingTasks.textContent =
        tasks.filter(task => !task.completed).length;

}

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}

displayTasks();