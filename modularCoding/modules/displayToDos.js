// @ts-nocheck
export function displayToDos(data) {
  const container = document.getElementById("todo-container");
  container.innerHTML = "";

  data.forEach((todo) => {
    const div = document.createElement("div");
    div.style.border = "1px solid #ccc";
    div.style.margin = "10px";
    div.style.padding = "10px";
    div.style.borderRadius = "6px";

    div.innerHTML = `
    <h3>${todo.title}</h3>
    <p>${todo.completed ? "completed" : "pending"}</p>`;

    container.appendChild(div);
  })
}
