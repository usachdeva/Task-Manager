// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
let form = $("#dialog-form");
let addNewTask = $("#add-new-task");
let tasks = [];

// diplay clock
function displayTime() {
    const today = dayjs().format("DD/MM/YYYY [at] hh:mm:ss");
    $("#live-clock").text(today).css("font-weight", "bolder");
}

// read tasks from storage
function readTasksFromStorage() {
    if (!taskList) {
        tasks = [];
    }
    return tasks;
}

// saving tasks
function saveTasksToStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Todo: create a function to generate a unique task id
function generateTaskId() {
    let taskId = Math.floor(Math.random() * 10);
    return taskId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $("<div>")
        .addClass("card task-card draggable my-3")
        .attr("data-task-id", task.id);
    const cardHeader = $("<div>").addClass("card-header h4").text(task.name);
    const cardBody = $("<div>").addClass("card-body");
    const cardDescription = $("<p>").addClass("card-text").text(task.status);
    const cardDueDate = $("<p>").addClass("card-text").text(task.dueDate);
    const cardDeleteBtn = $("<button>")
        .addClass("btn btn-danger delete")
        .text("Delete")
        .attr("data-project-id", task.id);
    cardDeleteBtn.on("click", handleDeleteTask);

    // ? Sets the card background color based on due date. Only apply the styles if the dueDate exists and the status is not done.
    if (task.dueDate && task.status !== "done") {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, "DD/MM/YYYY");

        // ? If the task is due today, make the card yellow. If it is overdue, make it red.
        if (now.isSame(taskDueDate, "day")) {
            taskCard.addClass("bg-warning text-white");
        } else if (now.isAfter(taskDueDate)) {
            taskCard.addClass("bg-danger text-white");
            cardDeleteBtn.addClass("border-light");
        } else if (now.isBefore(taskDueDate)) {
            taskCard.addClass("bg-light text-black");
            cardDeleteBtn.addClass("border-light");
        }

        // ? Gather all the elements created above and append them to the correct elements.
        cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
        taskCard.append(cardHeader, cardBody);

        // ? Return the card so it can be appended to the correct lane.
        return taskCard;
    }
}
// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const tasks = readTasksFromStorage();

    //Empty existing project cards out of the lanes
    const todoList = $("#todo-cards");
    todoList.empty();

    const inProgressList = $("#in-progress-cards");
    inProgressList.empty();

    const doneList = $("#done-cards");
    doneList.empty();

    // ? Loop through projects and create project cards for each status
    for (let task of tasks) {
        if (task.status == "to-do") {
            todoList.append(createTaskCard(task));
        } else if (task.status == "in-progress") {
            inProgressList.append(createTaskCard(task));
        } else if (task.status == "done") {
            doneList.append(createTaskCard(task));
        }
    }

    // ? Use JQuery UI to make task cards draggable
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

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    $(function () {
        let dialog,
            form,
            taskName = $("#task-name"),
            taskDueDate = $("#task-due-date"),
            taskStatus = $("#task-status");

        // adding date
        $(function () {
            $("#task-due-date").datepicker({
                changeMonth: true,
                changeYear: true,
            });
        });

        function addUser() {
            const newTask = {
                name: taskName.val(),
                dueDate: taskDueDate.val(),
                status: taskStatus.val(),
            };

            const tasks = readTasksFromStorage();

            tasks.push(newTask);

            renderTaskList();
            dialog.dialog("close");
        }

        dialog = $("#dialog-form").dialog({
            autoOpen: false,
            height: 450,
            width: 400,
            modal: true,
            buttons: {
                "Add Task": addUser,
                Cancel: function () {
                    dialog.dialog("close");
                },
            },
        });

        form = dialog.find("form").on("submit", function (event) {
            event.preventDefault();
            addUser();
        });

        $("#add-new-task")
            .button()
            .on("click", function () {
                dialog.dialog("open");
            });
    });
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    const taskId = $(this).attr("data-task-id");
    const tasks = readTasksFromStorage();

    tasks.forEach((task) => {
        if (task.id === taskId) {
            tasks.splice(tasks.indexOf(task), 1);
        }
    });

    saveTasksToStorage(tasks);

    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const tasks = readTasksFromStorage();

    const taskId = ui.draggable[0].dataset.taskId;
    const newStatus = event.target.id;

    for (let task of tasks) {
        if (task.id === taskId) {
            task.status = newStatus;
        }
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
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
