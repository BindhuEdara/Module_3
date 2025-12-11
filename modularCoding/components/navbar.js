export function Navbar() {
  return `
    <nav style="margin:10px;padding: 20px; background: #222; color: white; display: flex; justify-content: end; gap: 2px">
      <a href="index.html" style="margin-right: 15px; color:white">Home</a>
      <a href="signup.html" style="margin-right: 15px; color:white">Signup</a>
      <a href="login.html" style="margin-right: 15px; color:white">Login</a>
      <a href="todos.html" style="color:white">Todos</a>
    </nav>
  `;
}
