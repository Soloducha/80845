// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const usuarios = JSON.parse(
      localStorage.getItem("usuariosRegistrados") || "[]"
    );
    const usuario = usuarios.find(
      (u) => u.email === email && u.password === password
    );
    if (usuario) {
      localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
      if (usuario.admin) {
        console.log("Redirigiendo a admin.html");
        window.location.href = "./pages/admin.html";
      } else {
        console.log("Redirigiendo a home.html");
        window.location.href = "./pages/home.html";
      }
    } else {
      avisos.textContent = "Usuario o contraseña incorrectos";
      avisos.style.color = "red";
    }
  });
}
