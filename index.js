function saveTodosLocalStorage(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function createTodo(todoTemplate, todoTextContent, currentTodos, previousId) {
  const newTodo = todoTemplate.content.cloneNode(true);

  const newTodoId = previousId ?? `todo-${Object.keys(currentTodos).length}`;
  const newTodoListItem = newTodo.querySelector("li");
  if (newTodoListItem) {
    newTodoListItem.id = newTodoId;
  }

  const todoText = newTodo.querySelector("span");
  if (todoText) {
    todoText.textContent = todoTextContent;

    todoText.addEventListener("click", (ev) => {
      currentTodos[newTodoId].complete = !currentTodos[newTodoId].complete;
      ev.target.parentNode.dataset.complete = `${currentTodos[newTodoId].complete}`;
    });
  }

  const removeButton = newTodo.querySelector("button");
  if (removeButton) {
    removeButton.addEventListener("click", () => {
      document.getElementById(newTodoId)?.remove();

      delete currentTodos[newTodoId];
      saveTodosLocalStorage(currentTodos);
    });
  }

  return { id: newTodoId, templateNode: newTodo };
}

window.addEventListener("load", () => {
  const submissionBox = document.getElementById("submissionBox");
  const inputContainer = document.querySelector(".inputContainer");
  const todoList = document.querySelector("ul");
  const todoTemplate = document.querySelector("template");

  const currentTodos = JSON.parse(localStorage.getItem("todos")) ?? {};

  if (submissionBox && todoList && todoTemplate && inputContainer) {
    const previousTodos = Object.keys(currentTodos);
    if (previousTodos.length > 0) {
      previousTodos.forEach((key) => {
        const { templateNode } = createTodo(
          todoTemplate,
          currentTodos[key].text,
          currentTodos,
          key
        );

        const listItem = templateNode.querySelector("li");
        if (listItem) {
          listItem.dataset.complete = `${currentTodos[key].complete}`;
        }

        todoList.appendChild(templateNode);
      });
    }

    submissionBox.addEventListener("submit", (ev) => {
      ev.preventDefault();

      const inputBox = submissionBox.querySelector("input");

      if (inputBox) {
        const content = inputBox.value;

        if (!content) {
          inputContainer.dataset.error = "true";

          setTimeout(() => {
            inputContainer.dataset.error = "";
          }, 1000);

          return false;
        }

        const newTodo = createTodo(todoTemplate, content, currentTodos, null);

        todoList.appendChild(newTodo.templateNode);

        currentTodos[newTodo.id] = {
          text: content,
          complete: false,
        };
        saveTodosLocalStorage(currentTodos);

        inputBox.value = "";
      }
    });
  }
});
