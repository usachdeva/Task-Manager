// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
let form = $("#dialog-form");
let addNewTask = $("#add-new-task");

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return crypto.randomUUID();
}

// Display clock
function displayTime() {
    const today = dayjs().format("DD/MM/YYYY [at] hh:mm:ss");
    $("#live-clock").text(today).css("font-weight", "bolder");
}

// Read tasks from storage
function readTasksFromStorage() {
    let taskList = JSON.parse(localStorage.getItem("tasks"));
    if (!taskList) {
        taskList = [];
        localStorage.setItem("tasks", JSON.stringify(taskList));
    }
    return taskList;
}

// Save tasks to storage
function saveTasksToStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Create a function to create a task card
function createTaskCard(task) {
    const taskCard = $("<div>")
        .addClass("card task-card draggable my-3")
        .attr("data-task-id", task.id);
    const cardHeader = $("<div>").addClass("card-header h4").text(task.name);
    const cardBody = $("<div>").addClass("card-body");
    const cardDescription = $("<p>")
        .addClass("card-text")
        .text(task.description);
    const cardDueDate = $("<p>").addClass("card-text").text(task.dueDate);
    const cardDeleteBtn = $("<button>")
        .addClass("btn btn-danger delete")
        .text("Delete")
        .attr("data-task-id", task.id);
    cardDeleteBtn.on("click", handleDeleteTask);

    // to get the color of the cards as per the due date
    if (task.dueDate && task.description !== "done") {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, "DD/MM/YYYY");

        if (now.isSame(taskDueDate, "day")) {
            taskCard.addClass("bg-warning text-white");
            cardBody.addClass("bg-warning text-white");
        } else if (now.isAfter(taskDueDate)) {
            taskCard.addClass("bg-danger text-white");
            cardBody.addClass("bg-danger text-white");
            cardDeleteBtn.addClass("border-light");
        } else if (now.isBefore(taskDueDate)) {
            taskCard.addClass("bg-light text-black");
            cardDeleteBtn.addClass("border-light");
        }
    }

    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);
    return taskCard;
}

// Create a function to render the task list and make cards draggable
function renderTaskList() {
    const tasks = readTasksFromStorage();

    // Empty existing project cards out of the lanes
    const todoList = $("#todo-cards");
    todoList.empty();

    const inProgressList = $("#in-progress-cards");
    inProgressList.empty();

    const doneList = $("#done-cards");
    doneList.empty();

    // Loop through projects and create project cards for each status
    for (let task of tasks) {
        if (task.status == "to do") {
            todoList.append(createTaskCard(task));
        } else if (task.status == "in-progress") {
            inProgressList.append(createTaskCard(task));
        } else if (task.status == "done") {
            doneList.append(createTaskCard(task));
        }
    }

    // Use jQuery UI to make task cards draggable
    $(".draggable").draggable({
        opacity: 0.7,
        zIndex: 100,
        helper: function (e) {
            const original = $(e.target).hasClass("ui-draggable")
                ? $(e.target)
                : $(e.target).closest(".ui-draggable");

            return original.clone().css({
                width: original.outerWidth(),
            });
        },
    });
}

// Create a function to handle adding a new task
function handleAddTask(event) {
    let dialog,
        form,
        taskName = $("#task-name"),
        taskDueDate = $("#task-due-date"),
        taskDescription = $("#task-description");

    // Adding date picker
    $(function () {
        $("#task-due-date").datepicker({
            changeMonth: true,
            changeYear: true,
        });
    });

    function addTask() {
        const newTask = {
            id: generateTaskId(),
            name: taskName.val(),
            dueDate: taskDueDate.val(),
            description: taskDescription.val(),
            status: "to do",
        };

        const tasks = readTasksFromStorage();
        tasks.push(newTask);
        saveTasksToStorage(tasks); // Save tasks after adding

        renderTaskList();
        dialog.dialog("close");
    }

    dialog = $("#dialog-form").dialog({
        autoOpen: false,
        height: 350,
        width: 400,
        modal: true,
        buttons: {
            "Add Task": addTask,
            Cancel: function () {
                dialog.dialog("close");
            },
        },
    });

    form = dialog.find("form").on("submit", function (event) {
        event.preventDefault();
        addTask();
    });

    $("#add-new-task")
        .button()
        .on("click", function () {
            dialog.dialog("open");
        });
}

// Create a function to handle deleting a task
function handleDeleteTask(event) {
    const taskId = $(this).attr("data-task-id"); // Corrected attribute here
    let tasks = readTasksFromStorage();

    // using filter instead of splice to get the remaining tasks
    tasks = tasks.filter((task) => task.id !== taskId);

    saveTasksToStorage(tasks);
    renderTaskList();
}

// Create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const tasks = readTasksFromStorage();

    const newStatusContainer = event.target.id;
    const newStatusChild =
        document.getElementById(newStatusContainer).children[1].children[0];

    console.log(ui.draggable);
    console.log(newStatusChild); //target location

    ui.draggable.detach().appendTo(newStatusChild);
    ui.draggable.status = newStatusContainer;
    for (let task of tasks) {
        task.status = ui.draggable.status;
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
    // renderTaskList();
}

// When the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    form.hide();

    handleAddTask();

    displayTime();
    setInterval(displayTime, 1000);

    $(".lane").droppable({
        accept: ".draggable",
        drop: handleDrop,
    });
});
