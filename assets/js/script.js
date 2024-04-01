let addTask = $("#add-task");
let form = $("#dialog-form");
let tasks;

// Displaying live clock
function displayTime() {
  const today = dayjs().format("DD/MM/YYYY [at] hh:mm:ss");
  $("#live-clock").text(today);
}

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
  let taskId = Math.floor(Math.random() * tasks);
  return taskId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  if (taskList) {
    for (let task of taskList) {
      const card = $("<div>").addClass("task-card");

      const cardContent = $("<figure>")
        .addClass("card-content")
        .css("border", "2px solid black");

      const section = $("<section>")
        .addClass("card-content-header")
        .text(task.taskTitle)
        .css("border-bottom", "2px solid black");

      const newLine = $("<br>");

      const article = $("<article>")
        .addClass("<card-reminder>")
        .text(task.taskDesc);

      const dltBtn = $("<button>").addClass("delete-button").text("Delete");

      article.append(newLine);
      article.append(dltBtn);
      cardContent.append(section);
      cardContent.append(article);
      card.append(cardContent);

      //   checking for the to-do cards
      $("#todo-cards").append(card);

      // deleting function
      handleDeleteTask(event);
    }
  } else {
  }
}

// checking on the add button
addTask.on("click", () => {
  // event.preventDefault();
  handleAddTask();
  createTaskCard();
});

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {}

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

  function addUser() {
    // let valid = true;
    allFields.removeClass("ui-state-error");

    // valid = valid && checkLength( name, "username", 3, 16 );
    // valid = valid && checkLength( email, "email", 6, 80 );
    // valid = valid && checkLength( password, "password", 5, 16 );

    // valid = valid && checkRegexp( name, /^[a-z]([0-9a-z_\s])+$/i, "Username may consist of a-z, 0-9, underscores, spaces and must begin with a letter." );
    // valid = valid && checkRegexp( email, emailRegex, "eg. ui@jquery.com" );
    // valid = valid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9" );

    // if (valid) {
    // sending data to the localSttasks
    if (!localStorage.tasks) {
      tasks = [];
    } else {
      tasks = JSON.parse(localStorage.tasks);
    }

    // creating an object to access the data from user's input for the blog
    var currentTask = {
      tasksNumber: tasks.length,
      taskTitle: taskTitle.val(),
      taskDesc: taskDesc.val(),
    };

    tasks.push(currentTask);

    // saving data to usesr's array ad It only accepts the string values
    localStorage.tasks = JSON.stringify(tasks);

    dialog.dialog("close");
  }
  // return valid;
  // }

  dialog = $("#dialog-form").dialog({
    autoOpen: false,
    height: 500,
    width: 500,
    modal: true,
    buttons: {
      "Add-Task": addUser,
    },
    close: function () {
      form[0].reset();
      allFields.removeClass("ui-state-error");
    },
  });

  form = dialog.find("form").on("submit", function (event) {
    event.preventDefault();
    addUser();
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
});
