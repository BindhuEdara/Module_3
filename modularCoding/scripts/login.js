// @ts-nocheck
import { Navbar } from "../components/navbar.js";
import { Footer } from "../components/footer.js";

document.getElementById("navbar").innerHTML = Navbar();
document.getElementById("footer").innerHTML = Footer();

function loginUser() {
  const email = document.getElementById("email").value;
  const pwd = document.getElementById("password").value;

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("No user found. Please signup first.");
    return;
  }

  if (email === user.email && pwd === user.pwd) {
    alert("Login successful!");
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "todos.html";
  } else {
    alert("Invalid login details");
  }
};
document.getElementById("loginBtn").addEventListener("click", loginUser);
