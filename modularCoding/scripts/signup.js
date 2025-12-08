// @ts-nocheck
import { Navbar } from "../components/navbar.js";
import { Footer } from "../components/footer.js";

document.getElementById("navbar").innerHTML = Navbar();
document.getElementById("footer").innerHTML = Footer();

function addUser() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const pwd = document.getElementById("password").value;

  if (!name || !email || !pwd) {
    alert("Please fill all the fields");
    return;
  }
  const user = { name, email, pwd };
  localStorage.setItem("user", JSON.stringify(user));
  alert("Signup successful!");
  window.location.href = "login.html";
}

document.getElementById("signupBtn").addEventListener("click", addUser);
