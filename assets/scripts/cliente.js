// Mostrar mensaje de bienvenida en el elemento con id="bienvenida"
window.addEventListener("DOMContentLoaded", function () {
  const bienvenida = document.getElementById("bienvenida");
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado")) || [];
  const parrafo = document.createElement("p");
  if (usuario) {
    parrafo.textContent = `¡Bienvenido/a ${usuario.nombre} a la tienda de muebles!`;
  } else {
    parrafo.textContent = "¡Bienvenido/a a la tienda de muebles!";
  }

  bienvenida.innerHTML = ""; // Limpiar contenido previo
  bienvenida.appendChild(parrafo);
  // Crear y agregar el botón de Sign Out
  const botonSignOut = document.createElement("button");
  botonSignOut.id = "botonSignOut";
  botonSignOut.textContent = "Sign Out";
  botonSignOut.style.marginTop = "10px";
  bienvenida.appendChild(botonSignOut);

  // Mover el botón debajo del párrafo
  const SignOut = document.getElementById("botonSignOut");
  if (SignOut) {
    SignOut.addEventListener("click", function () {
      localStorage.removeItem("usuarioLogueado");
      window.location.href = "../index.html";
    });
  }
});

// Obtener la lista de muebles desde localStorage
let muebles = JSON.parse(localStorage.getItem("muebles")) || [];

const tbody = document.querySelector("#tablaMuebles tbody");
muebles.forEach(function (mueble, index) {
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${mueble.id}</td>
    <td>${mueble.tipo}</td>
    <td>${mueble.material}</td>
    <td>$${mueble.precio}</td>
    <td>${mueble.stock}</td>
    <td><button class="btnComprar" data-index="${index}">Comprar</button></td>
  `;
  tbody.appendChild(fila);
});

// Evento para los botones "Comprar"
tbody.addEventListener("click", function (e) {
  if (e.target.classList.contains("btnComprar")) {
    const idx = e.target.getAttribute("data-index");
    const mueble = muebles[idx];
    if (mueble.stock > 0) {
      mueble.stock--;
      e.target.closest("tr").children[4].textContent = mueble.stock;
      mostrarPopup(`¡Has comprado una ${mueble.tipo}!`, "green");
      // Guardar la venta en localStorage
      localStorage.setItem("muebles", JSON.stringify(muebles));

      const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
      const ventas = JSON.parse(localStorage.getItem("vendido")) || [];
      ventas.push({
        email: usuario.email,
        id: mueble.id,
        tipo: mueble.tipo,
        precio: mueble.precio,
        cantidad: 1,
      });
      localStorage.setItem("vendido", JSON.stringify(ventas));
    } else {
      mostrarPopup("No hay stock disponible.", "red");
    }
  }
});

// Función para mostrar popup
function mostrarPopup(mensaje, color = "green") {
  let popup = document.getElementById("popupMensaje");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "popupMensaje";
    popup.style.fontSize = "24px";
    document.body.appendChild(popup);
  }
  popup.textContent = mensaje;
  popup.style.color = color;
  popup.style.display = "block";
  setTimeout(() => {
    popup.style.display = "none";
  }, 2000);
}
