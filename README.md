# Task-Manager

```
Challenge 5 BootCamp UoFt 2024 coding
```

## User's Story

```
A project team member needs a task board to organize multple tasks,
SO THAT each member can add individual project tasks, manage their state of progress and track overall project progress accordingly.
```

## Acceptance

```
GIVEN a task board to manage a project
WHEN the user open the task board
THEN the list of project tasks is displayed in columns representing the task progress state (Not Yet Started, the usern Progress, Completed)
WHEN the user view the task board for the project
THEN each task is color coded to indicate whether it is nearing the deadline (yellow) or is overdue (red)
WHEN the user click on the button to define a new task
THEN the user can enter the title, description and deadline date for the new task into a modal dialog
WHEN the user click the save button for that task
THEN the properties for that task are saved in localStorage
WHEN the user drag a task to a different progress column
THEN the task's progress state is updated accordingly and will stay in the new column after refreshing
WHEN the user click the delete button for a task
THEN the task is removed from the task board and will not be added back after refreshing
WHEN the user refresh the page
THEN the saved tasks persist
```

## links

```
Repo link: https://github.com/usachdeva/Task-Manager
Deployed link: https://usachdeva.github.io/Task-Manager/
```

## Screenshot

<video controls src="assets/images/demo.mp4" title="Title"></video>
