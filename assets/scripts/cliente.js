// Definir la URL base de la API
const API_BASE = "http://localhost:3000/muebles";
// Mostrar mensaje de bienvenida al usuario
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

// inicializar arreglo de muebles y referencia al tbody
let muebles = [];
const tbody = document.querySelector("#tablaMuebles tbody");

// Función para cargar los muebles desde la "base de datos" suponiendo que el db.json es una base de datos
async function cargarMuebles() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("API no disponible");
    muebles = await res.json();
    cargarMueblesEnTabla(muebles);
    if (avisos) {
      avisos.textContent = "Muebles cargados desde la base de datos.";
      avisos.style.color = "green";
    }
  } catch (err) {
    if (avisos) {
      avisos.textContent =
        "No se pudo conectar al servidor json-server. ejecute en la terminal json-server --watch db.json --port 3000";
      avisos.style.color = "red";
    }
    muebles = [];
    renderTabla();
  }
}

// Fuincion para  cargar los muebles en la tbody
function cargarMueblesEnTabla(muebles) {
  tbody.innerHTML = ""; // Limpiar contenido previo
  muebles.forEach(function (mueble, index) {
    const fila = document.createElement("tr");
    fila.innerHTML = `
    <td>${mueble.id}</td>
    <td>${mueble.tipo}</td>
    <td>${mueble.material}</td>
    <td>$${mueble.precio}</td>
    <td>${mueble.stock}</td>
    <td><button class="btnComprar" data-index="${index}">Agregar al 🛒</button></td>
  `;
    tbody.appendChild(fila);
  });
}

// Evento para los botones "Comprar"
tbody.addEventListener("click", function (e) {
  if (e.target.classList.contains("btnComprar")) {
    const idx = e.target.getAttribute("data-index");
    const mueble = muebles[idx];
    if (mueble.stock > 0) {
      mueble.stock--;
      e.target.closest("tr").children[4].textContent = mueble.stock;
      mostrarPopup(`¡Has agregado al carrito ${mueble.tipo}!`, "green");
      // agrego en el carrito de compras el mueble
      sumarAlCarrito(mueble);
    } else {
      mostrarPopup("No hay stock disponible.", "red");
    }
  }
});

function sumarAlCarrito(mueble) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const index = carrito.findIndex((item) => item.id === mueble.id);

  //en el boton del carrito se muestra la cantidad de items
  let botonCarrito = document.getElementById("botonCarrito");
  let cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);
  botonCarrito.textContent = `🛒 ${cantidadTotal + 1}`;

  // Si el mueble ya está en el carrito, aumentar la cantidad
  if (index !== -1) {
    carrito[index].cantidad += 1;
  } else {
    carrito.push({
      id: mueble.id,
      tipo: mueble.tipo,
      precio: mueble.precio,
      cantidad: 1,
    });
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

//funcion al clickear el boton del carrito
let botonCarrito = document.getElementById("botonCarrito");
botonCarrito.addEventListener("click", function () {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  if (carrito.length === 0) {
    mostrarPopup("El carrito está vacío.", "red");
    return;
  }

  // evitar duplicar modal
  let overlay = document.getElementById("modalCarritoOverlay");
  if (overlay) overlay.remove();

  overlay = document.createElement("div");
  overlay.id = "modalCarritoOverlay";
  overlay.classList.add("modalCarritoOverlay");

  const modal = document.createElement("div");
  modal.classList.add("modalCarrito");

  // contenido del modal Carrito
  const titulo = document.createElement("h3");
  titulo.textContent = "Carrito de Compras";
  modal.appendChild(titulo);

  const lista = document.createElement("div");
  lista.style.maxHeight = "300px";
  lista.style.overflowY = "auto";
  carrito.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.style.marginBottom = "8px";
    itemDiv.textContent = `${item.tipo} — Cant: ${item.cantidad} — Subtotal: $${
      item.precio * item.cantidad
    }`;
    lista.appendChild(itemDiv);
  });
  modal.appendChild(lista);

  const total = carrito.reduce((acc, it) => acc + it.precio * it.cantidad, 0);
  const totalP = document.createElement("p");
  const totalIva = document.createElement("p");
  totalIva.style.fontWeight = "bold";
  totalP.textContent = `Total: $${total}`;
  totalIva.textContent = `(Total + IVA: $${(total * 1.21).toFixed(2)})`;
  modal.appendChild(totalP);
  modal.appendChild(totalIva);

  // botones del carrito
  const acciones = document.createElement("div");
  acciones.classList.add("modal-acciones");

  const btnVaciar = document.createElement("button");
  btnVaciar.textContent = "Vaciar carrito";
  btnVaciar.classList.add("btnVaciarCarrito");

  const btnConfirmar = document.createElement("button");
  btnConfirmar.textContent = "Confirmar compra";
  btnConfirmar.classList.add("btnConfirmarCompra");

  acciones.appendChild(btnVaciar);
  acciones.appendChild(btnConfirmar);
  modal.appendChild(acciones);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  function actualizarUIYCerrar() {
    localStorage.removeItem("carrito");
    actualizarBotonCarrito();
    //mostrarPopup(mensaje, color);
    overlay.remove();
  }

  btnVaciar.addEventListener("click", function () {
    // vaciar carrito
    localStorage.setItem("carrito", JSON.stringify([]));
    actualizarUIYCerrar();
    mostrarPopup("Carrito vaciado.", "orange");
  });

  btnConfirmar.addEventListener("click", function () {
    // se realiza la compra y se baja el stock en la "base de datos" bd.json
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.forEach((item) => {
      fetch(`${API_BASE}/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stock: muebles.find((m) => m.id === item.id).stock,
        }),
      }).catch((error) => {
        if (avisos) {
          avisos.textContent = `Error al actualizar el stock del mueble en la base de datos. ${error}`;
          avisos.style.color = "red";
        }
      });
    });
    actualizarUIYCerrar();
    mostrarPopup("¡Compra completada con éxito!");
  });
});

// Función para mostrar popup
function mostrarPopup(mensaje, color = "green") {
  let popup = document.getElementById("popupMensaje");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "popupMensaje";
    document.body.appendChild(popup);
  }
  popup.textContent = mensaje;
  popup.style.color = color;
  popup.style.display = "block";
  setTimeout(() => {
    popup.style.display = "none";
  }, 2500);
}

//funcion para actualizar el boton del carrito al cargar la pagina
function actualizarBotonCarrito() {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let botonCarrito = document.getElementById("botonCarrito");
  let cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);
  botonCarrito.textContent = `🛒 ${cantidadTotal}`;
}

// Cargar los muebles desde la "base de datos" y Actualizar el botón del carrito al cargar la página
cargarMuebles();
actualizarBotonCarrito();
