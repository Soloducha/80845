// Definir la URL base de la API
const API_BASE = "http://localhost:3000/muebles";
// Mostrar mensaje de bienvenida al administrador
const bienvenida = document.getElementById("bienvenida");
const avisos = document.getElementById("avisos");
const tabla = document.getElementById("tablaMuebles");

// asegurar tbody
let tbody = tabla ? tabla.querySelector("tbody") : null;
if (!tbody && tabla) {
  tbody = document.createElement("tbody");
  tabla.appendChild(tbody);
}
// Verificar si el usuario es admin
const usuario = JSON.parse(localStorage.getItem("usuarioLogueado")) || {};
if (!usuario.admin) {
  window.location.href = "home.html";
} else {
  const p = document.createElement("p");
  p.textContent = `¡Bienvenido/a Administrador ${usuario.nombre}!`;
  bienvenida.innerHTML = "";
  bienvenida.appendChild(p);
  // Agregar botón Sign Out
  const btnOut = document.createElement("button");
  btnOut.id = "botonSignOut";
  btnOut.textContent = "Sign Out";
  btnOut.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogueado");
    window.location.href = "../index.html";
  });
  bienvenida.appendChild(btnOut);
}

let muebles = [];

// mostrar popup mensajes genéricos
function mostrarPopup(mensaje, color = "green") {
  let popup = document.getElementById("popupMensaje");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "popupMensaje";
    popup.classList.add("popupMensaje");
    document.body.appendChild(popup);
  }
  popup.textContent = mensaje;
  popup.style.background = "#fff";
  popup.style.color = color;
  popup.style.display = "block";
  setTimeout(() => (popup.style.display = "none"), 2000);
}
// popup confirmación
function mostrarPopupConfirmacion(mensaje, onConfirm, onCancel) {
  let popup = document.getElementById("popupConfirmar");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "popupConfirmar";
    popup.classList.add("popupConfirmar");
    document.body.appendChild(popup);
  }
  popup.innerHTML = `
    <p style="margin-bottom:16px;">${mensaje}</p>
    <div style="text-align:right">
      <button id="confirmarEliminar">Sí</button>
      <button id="cancelarEliminar">No</button>
    </div>
  `;
  popup.style.display = "block";
  document.getElementById("confirmarEliminar").onclick = () => {
    popup.style.display = "none";
    if (typeof onConfirm === "function") onConfirm();
  };
  document.getElementById("cancelarEliminar").onclick = () => {
    popup.style.display = "none";
    if (typeof onCancel === "function") onCancel();
  };
}

// render de la tabla muebles
function renderTabla() {
  if (!tbody) return;
  tbody.innerHTML = "";
  muebles.forEach((m) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${m.id}</td>
      <td>${m.tipo}</td>
      <td>${m.material}</td>
      <td>$${m.precio}</td>
      <td>${m.stock}</td>
      <td><button class="botonEditar" data-id="${m.id}">Editar</button></td>
      <td><button class="botonEliminar" data-id="${m.id}">Eliminar</button></td>
    `;
    tbody.appendChild(tr);
  });
}

// API
async function cargarMuebles() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("API no disponible");
    muebles = await res.json();
    renderTabla();
    if (avisos) {
      avisos.textContent = "Muebles cargados desde servidor.";
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

async function agregarMuebleAPI(nuevo) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevo),
  });
  if (!res.ok) throw new Error("Error POST");
  return res.json();
}

async function actualizarMuebleAPI(m) {
  const res = await fetch(`${API_BASE}/${m.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(m),
  });
  if (!res.ok) throw new Error("Error PUT");
  return res.json();
}

async function eliminarMuebleAPI(id) {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error DELETE");
  return true;
}

// popups editar / agregar
function mostrarPopupEditar(mueble, onSave) {
  let popup = document.getElementById("popupEditar");
  const html = `
    <h3>Editar Mueble</h3>
    <label>Tipo:<br><input type="text" id="tipoEdit" value="${mueble.tipo}"></label><br><br>
    <label>Material:<br><input type="text" id="materialEdit" value="${mueble.material}"></label><br><br>
    <label>Precio:<br><input type="number" id="precioEdit" value="${mueble.precio}"></label><br><br>
    <label>Stock:<br><input type="number" id="stockEdit" value="${mueble.stock}"></label><br><br>
    <div style="text-align:right">
      <button id="guardarEdit">Guardar</button>
      <button id="cancelarEdit">Cancelar</button>
    </div>
  `;
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "popupEditar";
    popup.classList.add("popupEditar");
    popup.innerHTML = html;
    document.body.appendChild(popup);
  } else {
    popup.innerHTML = html;
    popup.style.display = "block";
  }

  document.getElementById("guardarEdit").onclick = async () => {
    mueble.tipo = document.getElementById("tipoEdit").value.trim();
    mueble.material = document.getElementById("materialEdit").value.trim();
    mueble.precio = Number(document.getElementById("precioEdit").value);
    mueble.stock = Number(document.getElementById("stockEdit").value);
    try {
      const actualizado = await actualizarMuebleAPI(mueble);
      const idx = muebles.findIndex((x) => x.id === actualizado.id);
      if (idx > -1) muebles[idx] = actualizado;
      renderTabla();
      mostrarPopup("Mueble actualizado.", "green");
      if (typeof onSave === "function") onSave();
      popup.style.display = "none";
    } catch (err) {
      if (avisos) {
        avisos.textContent = `Error actualizando en servidor: ${err}`;
        avisos.style.color = "red";
      }
    }
  };

  document.getElementById("cancelarEdit").onclick = () => {
    popup.style.display = "none";
  };
}

function mostrarPopupAgregar(onSave) {
  let popup = document.getElementById("popupAgregar");
  const html = `
    <h3>Agregar Mueble</h3>
    <label>Tipo:<br><input type="text" id="tipoNew"></label><br><br>
    <label>Material:<br><input type="text" id="materialNew"></label><br><br>
    <label>Precio:<br><input type="number" id="precioNew"></label><br><br>
    <label>Stock:<br><input type="number" id="stockNew"></label><br><br>
    <div>
      <button id="guardarNew">Guardar</button>
      <button id="cancelarNew">Cancelar</button>
    </div>
  `;
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "popupAgregar";
    popup.classList.add("popupAgregar");

    popup.innerHTML = html;
    document.body.appendChild(popup);
  } else {
    popup.innerHTML = html;
    popup.style.display = "block";
  }

  document.getElementById("guardarNew").onclick = async () => {
    const nuevoid =
      muebles.length > 0 ? Math.max(...muebles.map((m) => m.id)) + 1 : 1;
    const id = String(nuevoid);
    const tipo = document.getElementById("tipoNew").value.trim();
    const material = document.getElementById("materialNew").value.trim();
    const precio = Number(document.getElementById("precioNew").value);
    const stock = Number(document.getElementById("stockNew").value);
    if (!tipo || !material || isNaN(precio) || isNaN(stock)) {
      mostrarPopup("Completa todos los campos correctamente.", "red");
      return;
    }
    try {
      const creado = await agregarMuebleAPI({
        id,
        tipo,
        material,
        precio,
        stock,
      });
      muebles.push(creado);
      renderTabla();
      mostrarPopup("Mueble agregado.", "green");
      popup.style.display = "none";
      if (typeof onSave === "function") onSave();
    } catch (err) {
      if (avisos) {
        avisos.textContent = `Error agregando en servidor: ${err}`;
        avisos.style.color = "red";
      }
    }
  };

  document.getElementById("cancelarNew").onclick = () => {
    popup.style.display = "none";
  };
}

// delegación eventos editar/eliminar
tbody.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn || !tbody.contains(btn)) return;

  if (btn.classList.contains("botonEditar")) {
    const id = Number(btn.dataset.id);
    const mueble = muebles.find((m) => Number(m.id) === id);
    if (mueble) {
      mostrarPopupEditar(mueble);
    } else {
      if (avisos) {
        avisos.textContent = `No se encontró mueble para editar. id: ${id}`;
        avisos.style.color = "orange";
      }
    }
  }

  if (btn.classList.contains("botonEliminar")) {
    const id = Number(btn.dataset.id);
    const mueble = muebles.find((m) => Number(m.id) === id);
    if (!mueble) return;
    mostrarPopupConfirmacion(
      `¿Eliminar Mueble: ${mueble.tipo}?`,
      async () => {
        try {
          await eliminarMuebleAPI(id);
          muebles = muebles.filter((m) => Number(m.id) !== id);
          renderTabla();
          mostrarPopup("Mueble eliminado.", "green");
        } catch (err) {
          if (avisos) {
            avisos.textContent = `Error eliminando en servidor: ${err}`;
            avisos.style.color = "red";
          }
        }
      },
      () => {}
    );
  }
});

// boton agregar
const botonAgregar = document.getElementById("botonAgregarMueble");
if (botonAgregar) {
  botonAgregar.addEventListener("click", () => mostrarPopupAgregar());
}

// carga inicial
cargarMuebles();
