// selector
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todolist");
const filterOption = document.querySelector(".filter-todos");

// event 
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", checkRemove);
filterOption.addEventListener("click", filterTodos);
document.addEventListener("DOMContentLoaded", getLocalTodos);

// function
function addTodo(event) {
  event.preventDefault();
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");
  const newTodo = `
    <li>${todoInput.value}</li>
    <span><i class="fa-solid fa-pen-to-square"></i></span>
    <span><i class="fa-regular fa-square-check"></i></span>
    <span><i class="fa-solid fa-trash-can"></i></span>
  `;
  todoDiv.innerHTML = newTodo;
  todoList.appendChild(todoDiv);
  saveLocalTodos(todoInput.value);
  todoInput.value = "";
}

function checkRemove(event) {
  const item = event.target;
  const classList = [...item.classList];

  if (classList[1] === "fa-square-check") {
    const todo = item.parentElement.parentElement;
    todo.classList.toggle("completed");
    updateCompletedTodos(todo.querySelector("li").innerText);
  } else if (classList[1] === "fa-trash-can") {
    const todo = item.parentElement.parentElement;
    removeLocalTodos(todo);
    todo.remove();
  } else if (classList[1] === "fa-pen-to-square") {
    const todo = item.parentElement.parentElement;
    editTodo(todo);
  }
}

function filterTodos(event) {
  const todos = [...todoList.childNodes];

  todos.forEach((todo) => {
    switch (event.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "inprogress":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
    }
  });
}

function editTodo(todo) {
  const todoText = todo.querySelector("li");
  const currentText = todoText.innerText;
  const newText = prompt("Enter the new text:", currentText);
  if (newText) {
    todoText.innerText = newText;
    updateLocalTodo(currentText, newText);
    todo.classList.remove("completed");
    todo.style.display = "flex";
  }
}

// Local
function saveLocalTodos(todo) {
  let savedTodos = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : [];
  savedTodos.push(todo);
  localStorage.setItem("todos", JSON.stringify(savedTodos));
}

function getLocalTodos() {
  let savedTodos = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : [];

  savedTodos.forEach((todo) => {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    const newTodo = `
      <li>${todo}</li>
      <span><i class="fa-solid fa-pen-to-square"></i></span>
      <span><i class="fa-regular fa-square-check"></i></span>
      <span><i class="fa-solid fa-trash-can"></i></span>`;
    todoDiv.innerHTML = newTodo;

    const todoText = todoDiv.querySelector("li");
    if (isTodoCompleted(todo)) {
      todoDiv.classList.add("completed");
    }

    todoList.appendChild(todoDiv);
  });
}

function removeLocalTodos(todo) {
  let savedTodos = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : [];
  const filteredTodos = savedTodos.filter((t) => t !== todo.children[0].innerText);
  localStorage.setItem("todos", JSON.stringify(filteredTodos));
}

function updateLocalTodo(oldText, newText) {
  let savedTodos = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : [];

  const updatedTodos = savedTodos.map((todo) => {
    if (todo === oldText) {
      return newText;
    }
    return todo;
  });

  localStorage.setItem("todos", JSON.stringify(updatedTodos));
}

function isTodoCompleted(todo) {
  let completedTodos = localStorage.getItem("completedTodos") ? JSON.parse(localStorage.getItem("completedTodos")) : [];
  return completedTodos.includes(todo);
}

function updateCompletedTodos(todoText) {
  let completedTodos = localStorage.getItem("completedTodos") ? JSON.parse(localStorage.getItem("completedTodos")) : [];
  const todoIndex = completedTodos.indexOf(todoText);

  if (todoIndex === -1) {
    completedTodos.push(todoText);
  } else {
    completedTodos.splice(todoIndex, 1);
  }

  localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
}
