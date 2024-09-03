// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
    let id = nextId;
    nextId++;
    localStorage.setItem("nextId", nextId);
    return id;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    let card = $("<div>").addClass("card task-card").attr("id", task.id);
    let cardBody = $("<div>").addClass("card-body");
    let cardTitle = $("<h3>").addClass("card-title").text(task.title);
    let cardText = $("<p>").addClass("card-text").text(task.description);
    let cardDueDate = $("<p>").addClass("card-text").text(task.dueDate);
    let deleteTask = $("<button>").addClass("btn btn-danger").text("Delete");
   
    deleteTask.click(handleDeleteTask);
    cardBody.append(cardTitle, cardText, cardDueDate, deleteTask);
    card.append(cardBody);

    return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    for(task of taskList) {
        let card = createTaskCard(task);
        $("#" + task.status).append(card);
        card.draggable({
            revert: "invalid",
            helper: "clone"
        });
    };
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    let title = $("#taskName").val();
    let description = $("#taskDescription").val();
    let dueDate = $("#taskDueDate").val();

    let task = {
        id: generateTaskId(),
        title: title,
        description: description,
        dueDate: dueDate,
        status: "to-do"
    };
    
    taskList.push(task);
    localStorage.setItem("tasks", JSON.stringify(taskList));

    let card = createTaskCard(task);
    $("#to-do").append(card);

    card.draggable({
        revert: "invalid",
        helper: "clone"
    });

    $("#formModal").modal("hide");

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

    let card = $(event.target).parent().parent();
    let id = card.attr("id");
    card.remove();

    taskList = taskList.filter(task => task.id != id);
    localStorage.setItem("tasks", JSON.stringify(taskList));
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    
    let id = $(ui.draggable).attr("id");
    let task = taskList.find(task => task.id == id);

    if (task.status == $(this).attr("id")) {
        return;
    } else {
        $(ui.draggable).detach().appendTo(this);
        task.status = $(this).attr("id");
        localStorage.setItem("tasks", JSON.stringify(taskList));
    }
}
// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    $("#addTask").click(handleAddTask);
    $(".lane").droppable({
        drop: handleDrop
    });

    $("#dueDate").datepicker();
});