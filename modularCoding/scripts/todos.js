// @ts-nocheck
import { Navbar } from "../components/navbar.js";
import { Footer } from "../components/footer.js";
import { displayToDos } from "../modules/displayToDos.js";

document.getElementById("navbar").innerHTML = Navbar();
document.getElementById("footer").innerHTML = Footer();

// Check login
if (localStorage.getItem("isLoggedIn") !== "true") {
  alert("Please login first");
  window.location.href = "login.html";
}

async function loadTodos() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = await res.json();
    displayToDos(data);
  } catch (err) {
    console.log("Error fetching todos", err);
  }
}
loadTodos();
