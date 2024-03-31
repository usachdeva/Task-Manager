const addTask = $("#add-task");
const form = $("#dialog-form");

// form values
const title = $("#task-title").value;
const taskDesc = $("#task-description").value;

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
  let taskId = Math.floor(Math.random() * 20);
  console.log(taskId);
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  const card = $("<div>").addClass("task-card");

  const cardContent = $("<figure>")
    .addClass("card-content")
    .css("border", "2px solid black");

  const section = $("<section>")
    .addClass("card-content-header")
    .text(title)
    .css("border-bottom", "2px solid black");

  const newLine = $("<br>");

  const article = $("<article>").addClass("<card-reminder>").text(taskDesc);

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

// checking on the add button
addTask.on("click", () => {
  // event.preventDefault();

  // createTaskCard();

  handleAddTask();
});

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  let tasks;
  if (!localStorage.tasks) {
    tasks = [];
  }
  tasks = JSON.parse(taskList);
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  let dialog,
    form,
    taskTitle = $("#task-title"),
    taskDueDate = $("#task-due-date"),
    taskDescription = $("#task-description"),
    allFields = $([]).add(taskTitle).add(taskDueDate).add(taskDescription),
    addYourTask = $(".add-your-task");

  // adding the calendar
  $(function () {
    $("#task-due-date").datepicker({
      changeMonth: true,
      changeYear: true,
    });
  });

  function updateTasks(t) {
    addYourTask.text(t).addClass("ui-state-highlight");
    setTimeout(function () {
      addYourTask.removeClass("ui-state-highlight", 1500);
    }, 500);
  }

  function addUser() {
    let valid = true;
    // allFields.removeClass("ui-state-error");

    // valid = valid && checkLength( name, "username", 3, 16 );
    // valid = valid && checkLength( email, "email", 6, 80 );
    // valid = valid && checkLength( password, "password", 5, 16 );

    // valid = valid && checkRegexp( name, /^[a-z]([0-9a-z_\s])+$/i, "Username may consist of a-z, 0-9, underscores, spaces and must begin with a letter." );
    // valid = valid && checkRegexp( email, emailRegex, "eg. ui@jquery.com" );
    // valid = valid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9" );

    if (valid) {
      createTaskCard(task);
      // dialog.dialog("close");
    }
    return valid;
  }

  dialog = $("#dialog-form").dialog({
    autoOpen: false,
    height: 300,
    width: 350,
    modal: true,
    buttons: {
      "Add-Task": addUser,
    },
    close: function () {
      form[0].reset();
      // allFields.removeClass("ui-state-error");
    },
  });

  form = dialog.find("form").on("submit", function (event) {
    // event.preventDefault();
    addUser();
  });

  addTask.on("click", function () {
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
});
