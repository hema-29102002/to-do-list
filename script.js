let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.text;

    const taskTime = document.createElement("span");
    taskTime.className = "task-time";
    taskTime.textContent = task.due ? `⏰ ${new Date(task.due).toLocaleString()}` : "";

    const actions = document.createElement("div");
    actions.className = "actions";

    const checkBtn = document.createElement("button");
    checkBtn.textContent = task.completed ? "Undo" : "Done";
    checkBtn.onclick = () => toggleComplete(index);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editTask(index);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteTask(index);

    actions.appendChild(checkBtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(taskText);
    li.appendChild(taskTime);
    li.appendChild(actions);
    taskList.appendChild(li);
  });
}

function addTask() {
  const text = document.getElementById("taskInput").value.trim();
  const due = document.getElementById("dueDate").value;

  if (!text) {
    alert("Task cannot be empty!");
    return;
  }

  tasks.push({ text, due, completed: false });
  saveTasks();
  renderTasks();
  document.getElementById("taskInput").value = "";
  document.getElementById("dueDate").value = "";
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const newText = prompt("Edit your task:", tasks[index].text);
  if (newText) {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

// Check for reminders every minute
setInterval(() => {
  const now = new Date();
  tasks.forEach((task, index) => {
    if (
      task.due &&
      !task.completed &&
      !task.reminded &&
      new Date(task.due) <= now
    ) {
      alert(`🔔 Reminder: ${task.text}`);
      tasks[index].reminded = true;
      saveTasks();
    }
  });
}, 60000); // every 60 seconds

renderTasks();
