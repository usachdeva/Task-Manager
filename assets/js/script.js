let addTask = $("#add-task");
let form = $("#dialog-form");
let tasks;
let taskId;
let tasksInProgress;
let tasksDone;

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Displaying live clock
// working
function displayTime() {
  const today = dayjs().format("DD/MM/YYYY [at] hh:mm:ss");
  $("#live-clock").text(today).css("font-weight", "bolder");
}

// Todo: create a function to generate a unique task id
// working
function generateTaskId() {
  let taskId = Math.floor(Math.random());
  return taskId;
}

// read tasks from storage
// working
function readTasksFromStorage() {
  if (!taskList) {
    localStorage.setItem("tasks", JSON.stringify([]));
  }
  return taskList;
}

// saving tasks into the localStorage
// working
function saveTasksToStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Todo: create a function to create a task card
// working
function createToDoTask(task) {
  // clearing the field
  // $("#todo-cards").text("");

  // let taskList = JSON.parse(localStorage.getItem("tasks"));

  // if (taskList) {
  //   for (let task of taskList) {
  // task-card
  const taskCard = $("<div>")
    .addClass("card task-card draggable my-3")
    .attr("data-card-id", task.taskId);

  const cardHeader = $("<div>").addClass("card-header h4").text(task.taskTitle);

  const cardBody = $("<div>").addClass("card-body");

  const cardDescription = $("<p>").addClass("card-text").text(task.taskDesc);

  const cardDueDate = $("<p>").addClass("card-text").text(task.taskDue);

  const cardDeleteBtn = $("<button>")
    .addClass("btn btn-danger delete")
    .text("Delete")
    .attr("data-project-id", task.taskId);
  cardDeleteBtn.on("click", handleDeleteTask);

  // setting the background-color
  if (task.taskDue && task.status !== "done") {
    const today = dayjs();
    const taskDueDate = dayjs(task.taskDue, "DD/MM/YYYY");

    // ? If the task is due today, make the card yellow. If it is overdue, make it red.
    if (today.isSame(taskDueDate, "day")) {
      taskCard.addClass("bg-warning text-white");
    } else if (today.isAfter(taskDueDate)) {
      taskCard.addClass("bg-danger text-white");
      cardDeleteBtn.addClass("border-light");
    }
  }

  // combining the elements
  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);

  return taskCard;
}
//   }
// }

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  let tasks = readTasksFromStorage();

  // empty the existing the card lanes
  const todoList = $("#todo-cards");
  todoList.empty();

  const inProgressList = $("#in-progress-cards");
  inProgressList.empty();

  const doneList = $("#done-cards");
  doneList.empty();

  // Loop through the cards and create according to the status
  for (let task of tasks) {
    if (task.status == "to-do") {
      todoList.append(createToDoTask(task));
    } else if (task.status == "in-progress") {
      inProgressList.append(createToDoTask(task));
    } else if (task.status == "done") {
      doneList.append(createToDoTask(task));
    }
  }

  // making the cards draggable
  $(".draggable").draggable({
    zIndex: 100,
    // to create clone of the cards
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
  event.preventDefault();
  // form variables
  let dialog,
    form,
    taskTitle = $("#task-title"),
    taskDue = $("#task-due-date"),
    taskDesc = $("#task-description"),
    allFields = $([]).add(taskTitle).add(taskDue).add(taskDesc),
    addYourTask = $(".add-your-task");

  //date-picker
  $(() => {
    $("#task-due-date").datepicker({
      changeMonth: true,
      changeYear: true,
    });
  });

  function updateTasks(task) {
    addYourTask.text(task).addClass("ui-state-highlight");
    setTimeout(function () {
      addYourTask.removeClass("ui-state-highlight", 1500);
    }, 500);
  }

  function addTaskToLocalStorage() {
    allFields.removeClass("ui-state-error");

    if (!localStorage.tasks) {
      tasks = [];
    } else {
      tasks = JSON.parse(localStorage.tasks);
    }

    // creating an object to access the data from user's input for the blog
    var currentTask = {
      taskId: generateTaskId,
      taskTitle: taskTitle.val(),
      taskDue: taskDue.val(),
      taskDesc: taskDesc.val(),
    };

    tasks.push(currentTask);

    // saving data to usesr's array ad It only accepts the string values
    saveTasksToStorage(tasks);

    dialog.dialog("close");

    // creating the cards

    renderTaskList();
  }
  // return valid;
  // }

  dialog = $("#dialog-form").dialog({
    autoOpen: false,
    height: 500,
    width: 500,
    modal: true,
    buttons: {
      "Add-Task": addTaskToLocalStorage,
    },
    close: function () {
      form[0].reset();
      allFields.removeClass("ui-state-error");
    },
  });

  form = dialog.find("form").on("submit", function (event) {
    event.preventDefault();
    addTaskToLocalStorage();
  });

  $("#add-task")
    .button()
    .on("click", function () {
      dialog.dialog("open");
    });
}

// activating the addtask button
$("#add-task").on("click", handleAddTask);

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  // deleting the cards
  $(".delete-button").on("click", function (event) {
    $(this).closest(".task-card").remove(); // Remove the closest parent element with class "task-item"

    const taskId = $(this).attr("data-card-id");
    const tasks = readProjectsFromStorage();

    tasks.forEach((task) => {
      if (task.id === taskId) {
        tasks.splice(tasks.indexOf(task), 1);
      }
    });

    saveTasksToStorage(tasks);

    renderTaskList();
  });
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  // ? Read projects from localStorage
  const tasks = readTasksFromStorage();

  // ? Get the project id from the event
  const taskId = ui.draggable[0].dataset.taskId;

  // ? Get the id of the lane that the card was dropped into
  const newStatus = event.target.id;

  for (let task of tasks) {
    // ? Find the project card by the `id` and update the project status.
    if (task.id === taskId) {
      task.status = newStatus;
    }
  }
  // ? Save the updated projects array to localStorage (overwritting the previous one) and render the new project data to the screen.
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  // createToDoTask();
  // making the lanes droppable
  $(".lane").droppable({
    accept: ".draggable",
    drop: handleDrop,
  });
  // basic function, not affecting anything
  form.hide();
  displayTime();
  setInterval(displayTime, 1000);
});

generateTaskId();
