// Mostrar mensaje de bienvenida al usuario
window.addEventListener("DOMContentLoaded", function () {
  //esperar a que cargue el DOM
  const bienvenida = document.getElementById("bienvenida");
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado")) || [];
  const parrafo = document.createElement("p");
  if (usuario.admin) {
    // Verificar si es admin, sino redirigir a home clientes
    parrafo.textContent = `¡Bienvenido/a Administrador ${usuario.nombre}`;
  } else {
    window.location.href = "home.html";
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
    <td><button class="botonEditar" data-index="${index}">Editar</button></td>
    <td><button class="botonEliminar" data-index="${index}">Eliminar</button></td>
  `;
  tbody.appendChild(fila);
});

// Evento para los botones "Editar"
tbody.addEventListener("click", function (e) {
  if (e.target.classList.contains("botonEditar")) {
    const idx = e.target.getAttribute("data-index");
    const mueble = muebles[idx];
    mostrarPopupEditar(mueble, function () {
      // Actualizar la fila en la tabla
      const fila = e.target.closest("tr");
      // fila.children[0].textContent = mueble.id; //no la modifico porque es fija
      fila.children[1].textContent = mueble.tipo;
      fila.children[2].textContent = mueble.material;
      fila.children[3].textContent = `$${mueble.precio}`;
      fila.children[4].textContent = mueble.stock;
      // Guardar los cambios en localStorage
      localStorage.setItem("muebles", JSON.stringify(muebles));
    });
  }
});

//Evento para boton "Eliminar"
tbody.addEventListener("click", function (e) {
  if (e.target.classList.contains("botonEliminar")) {
    const idx = e.target.getAttribute("data-index");
    const mueble = muebles[idx];
    mostrarPopupConfirmacion(
      `¿Estás seguro de eliminar el mueble: ${mueble.tipo}?`,
      function () {
        muebles.splice(idx, 1); // Eliminar mueble del array por su id y 1 solo elemento
        localStorage.setItem("muebles", JSON.stringify(muebles));
        e.target.closest("tr").remove();
        mostrarPopup("Mueble eliminado correctamente.", "green");
      },
      function () {
        // Cancelado, no hacer nada
      }
    );
  }
});

//Evento para boton Agregar Mueble
const botonAgregar = document.getElementById("botonAgregarMueble");
if (botonAgregar) {
  botonAgregar.addEventListener("click", function () {
    mostrarPopupAgregarMueble(function () {
      // Refrescar la tabla
      tbody.innerHTML = "";
      muebles = JSON.parse(localStorage.getItem("muebles")) || [];
      muebles.forEach(function (mueble, index) {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${mueble.id}</td>
          <td>${mueble.tipo}</td>
          <td>${mueble.material}</td>
          <td>$${mueble.precio}</td>
          <td>${mueble.stock}</td>
          <td><button class="botonEditar" data-index="${index}">Editar</button></td>
        `;
        tbody.appendChild(fila);
      });
    });
  });
}

// Función para mostrar el popup de edición
function mostrarPopupEditar(mueble, onSave) {
  // Crear el popup
  let popup = document.getElementById("popupEditar");

  if (!popup) {
    popup = document.createElement("div");
    popup.id = "popupEditar";
    popup.innerHTML = `
      <h3>Editar Mueble</h3>
      <label>Tipo:<br><input type="text" id="tipoAEditar" value="${mueble.tipo}"></label><br><br>
      <label>Material:<br><input type="text" id="materialAEditar" value="${mueble.material}"></label><br><br>
      <label>Precio:<br><input type="number" id="precioAEditar" value="${mueble.precio}"></label><br><br>
      <label>Stock:<br><input type="number" id="stockAEditar" value="${mueble.stock}"></label><br><br>
      <button id="guardarEdicion">Guardar</button>
      <button id="cancelarEdicion">Cancelar</button>
    `;
    document.body.appendChild(popup);
  } else {
    //se actualizan los valores,sino aparecen los del mueble editado anteriormente
    popup.innerHTML = `
      <h3>Editar Mueble</h3>
      <label>Tipo:<br><input type="text" id="tipoAEditar" value="${mueble.tipo}"></label><br><br>
      <label>Material:<br><input type="text" id="materialAEditar" value="${mueble.material}"></label><br><br>
      <label>Precio:<br><input type="number" id="precioAEditar" value="${mueble.precio}"></label><br><br>
      <label>Stock:<br><input type="number" id="stockAEditar" value="${mueble.stock}"></label><br><br>
      <button id="guardarEdicion">Guardar</button>
      <button id="cancelarEdicion">Cancelar</button>
    `;
    popup.style.display = "block";
  }

  document.getElementById("guardarEdicion").onclick = function () {
    mueble.tipo = document.getElementById("tipoAEditar").value;
    mueble.material = document.getElementById("materialAEditar").value;
    mueble.precio = Number(document.getElementById("precioAEditar").value);
    mueble.stock = Number(document.getElementById("stockAEditar").value);
    popup.style.display = "none";
    if (typeof onSave === "function") onSave(); //
  };

  document.getElementById("cancelarEdicion").onclick = function () {
    popup.style.display = "none";
  };
}

function mostrarPopupAgregarMueble(onSave) {
  let popup = document.getElementById("popupAgregar");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "popupAgregar";
    popup.innerHTML = `
      <h3>Agregar Mueble</h3>
      <label>Tipo:<br><input type="text" id="nuevoTipo"></label><br><br>
      <label>Material:<br><input type="text" id="nuevoMaterial"></label><br><br>
      <label>Precio:<br><input type="number" id="nuevoPrecio"></label><br><br>
      <label>Stock:<br><input type="number" id="nuevoStock"></label><br><br>
      <button id="guardarNuevoMueble">Guardar</button>
      <button id="cancelarNuevoMueble">Cancelar</button>
    `;
    document.body.appendChild(popup);
  } else {
    popup.style.display = "block";
  }

  document.getElementById("guardarNuevoMueble").onclick = function () {
    const tipo = document.getElementById("nuevoTipo").value.trim();
    const material = document.getElementById("nuevoMaterial").value.trim();
    const precio = Number(document.getElementById("nuevoPrecio").value);
    const stock = Number(document.getElementById("nuevoStock").value);

    if (!tipo || !material || isNaN(precio) || isNaN(stock)) {
      mostrarPopup("Completa todos los campos correctamente.", "red");
      return;
    }

    // Generar nuevo ID de manera automática
    let muebles = JSON.parse(localStorage.getItem("muebles")) || [];
    const nuevoId =
      muebles.length > 0 ? Math.max(...muebles.map((m) => m.id)) + 1 : 1;

    const nuevoMueble = {
      id: nuevoId,
      tipo: tipo,
      material: material,
      precio: precio,
      stock: stock,
    };

    muebles.push(nuevoMueble);
    localStorage.setItem("muebles", JSON.stringify(muebles));
    popup.style.display = "none";
    if (typeof onSave === "function") onSave();
    mostrarPopup("Mueble agregado correctamente.", "green");
  };

  document.getElementById("cancelarNuevoMueble").onclick = function () {
    popup.style.display = "none";
  };
}

// Función para mostrar popup de confirmación
function mostrarPopupConfirmacion(mensaje, onConfirm, onCancel) {
  let popup = document.getElementById("popupConfirmar");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "popupConfirmar";
    popup.innerHTML = `
      <p style="margin-bottom:20px;">${mensaje}</p>
      <button id="confirmarEliminar">Confirmar</button>
      <button id="cancelarEliminar">Cancelar</button>
    `;
    document.body.appendChild(popup);
  } else {
    popup.innerHTML = `
      <p style="margin-bottom:20px;">${mensaje}</p>
      <button id="confirmarEliminar">Confirmar</button>
      <button id="cancelarEliminar">Cancelar</button>
    `;
    popup.style.display = "block";
  }

  document.getElementById("confirmarEliminar").onclick = function () {
    popup.style.display = "none";
    if (typeof onConfirm === "function") onConfirm();
  };

  document.getElementById("cancelarEliminar").onclick = function () {
    popup.style.display = "none";
    if (typeof onCancel === "function") onCancel();
  };
}
