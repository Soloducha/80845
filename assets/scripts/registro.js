// Manejo del formulario de registro
document
  .getElementById("registroForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const admin = document.getElementById("admin").checked;

    // Obtener usuarios registrados (array) de localStorage
    let usuarios =
      JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];

    // Chequear si el email ya está registrado
    const emailExiste = usuarios.some(function (usuario) {
      return usuario.email === email;
    });

    if (emailExiste) {
      avisos.textContent = "El email ya se encuentra registrado";
      avisos.style.color = "red";
      return;
    }

    const usuario = {
      nombre: nombre,
      email: email,
      password: password,
      admin: admin,
    };

    // Agregar el nuevo usuario al array y guardar en localStorage
    usuarios.push(usuario);
    localStorage.setItem("usuariosRegistrados", JSON.stringify(usuarios));

    avisos.textContent =
      "Usuario registrado correctamente. Redirigiendo al inicio...";
    avisos.style.color = "green";
    setTimeout(function () {
      window.location.href = "../index.html";
    }, 3000);
  });
