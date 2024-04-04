let addTask = $("#add-task");
let form = $("#dialog-form");
let tasks;
let tasksInProgress;
let tasksDone;

// Displaying live clock
function displayTime() {
  const today = dayjs().format("DD/MM/YYYY [at] hh:mm:ss");
  $("#live-clock").text(today).css("font-weight", "bolder");
}

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
  let taskId = Math.floor(Math.random());
  return taskId;
}

// Todo: create a function to create a task card
function createToDoTask() {
  // clearing the field
  $("#todo-cards").text("");

  let taskList = JSON.parse(localStorage.getItem("tasks"));

  if (taskList) {
    for (let task of taskList) {
      const card = $("<div>").addClass("task-card draggable");

      const cardContent = $("<figure>")
        .addClass("card-content")
        .attr("id", task.tasksNumber)
        .css("border", "2px solid black");

      const section = $("<section>")
        .addClass("card-content-header")
        .text(task.taskTitle)
        .css("border-bottom", "2px solid black");

      const newLine = $("<br>");

      const article = $("<article>").addClass("card-main-content");

      const para = $("<p>").addClass("card-status").text(task.taskDesc);
      const para1 = $("<p>").addClass("card-status-date").text(task.taskDue);

      const dltBtn = $("<button>").addClass("delete-button").text("Delete");

      article.append(para);
      article.append(para1);
      article.append(dltBtn);
      cardContent.append(section);
      cardContent.append(article);
      card.append(cardContent);

      //   checking for the to-do cards
      $("#todo-cards").append(card);

      // adding styles to the cards
      // let today = dayjs();
      // if (task.taskDue.diff(today, "day") < 0) {
      //   // cardContent.addClass("passedDue");
      //   cardContent.attr("color", "red");
      //   console.log("Project passed due date");
      // } else if (task.taskDue.diff(today, "day") > 0) {
      //   cardContent.addClass("futureDue");
      //   console.log("Project due in the future");
      // }

      // deleting function
      handleDeleteTask(event);
    }
  } else {
    console.log("No tasks found");
  }
}

// checking on the add button
addTask.on("click", () => {
  // event.preventDefault();

  $("#todo-cards, #in-progress-cards, #done-cards").addClass(
    "cards-area-color"
  );
  handleAddTask();
});

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  createToDoTask();

  console.log();

  $(function () {
    $(".draggable").draggable({
      helper: "clone",
      containment: "document",
    });
    $(".card-body #in-progress-cards").droppable({
      drop: function (event, ui) {
        alert("I am dropped");
        ui.draggable.detach().appendTo($(this));
      },
    });
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
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
      tasksNumber: tasks.length,
      taskTitle: taskTitle.val(),
      taskDue: taskDue.val(),
      taskDesc: taskDesc.val(),
    };

    tasks.push(currentTask);

    // saving data to usesr's array ad It only accepts the string values
    localStorage.tasks = JSON.stringify(tasks);

    dialog.dialog("close");

    // creating the cards

    createToDoTask();
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

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  // deleting the cards
  $(".delete-button").on("click", function (event) {
    $(this).closest(".task-card").remove(); // Remove the closest parent element with class "task-item"
    console.log("Task deleted");
  });
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  form.hide();
  generateTaskId();
  renderTaskList();
  displayTime();
  setInterval(displayTime, 1000);
  createToDoTask();
});
