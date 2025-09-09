let nomyape;
do {
  nomyape = prompt("Ingrese su nombre y apellido:");
  if (nomyape === null || nomyape.trim() === "") {
    alert("Debe ingresar su nombre y apellido para continuar.");
  }
} while (nomyape === null || nomyape.trim() === "");

alert(`Bienvenido/a ${nomyape} a nuestra tienda de muebles!`);
console.log("Bienvenido/a " + nomyape + " a la tienda de muebles!");

// defino la clase Mueble
class Mueble {
  constructor(id, tipo, material, precio, stock) {
    this.id = id;
    this.tipo = tipo;
    this.material = material;
    this.precio = precio;
    this.stock = stock;
  }

  mostrarInfoCompleta() {
    return `ID: ${this.id}, Tipo: ${this.tipo}, Material: ${this.material}, Precio: $${this.precio}, Stock: ${this.stock}`;
  }

  mostrarInfoVenta() {
    return `Compró: ${this.tipo}
de: ${this.material}
a: $${this.precio}`;
  }

  setStock(nuevoStock) {
    this.stock = nuevoStock;
  }

  setPrecio(nuevoPrecio) {
    this.precio = nuevoPrecio;
  }
}

// función para mostrar todos los muebles
function mostrarMuebles() {
  for (let i = 0; i < muebles.length; i++) {
    console.log(muebles[i].mostrarInfoCompleta());
  }
}

// Función genérica para mostrar resultados
function mostrarResultados(mueblesArray, mensajeDeNoEncontrado) {
  if (mueblesArray.length > 0) {
    for (let i = 0; i < mueblesArray.length; i++) {
      console.log(mueblesArray[i].mostrarInfoCompleta());
    }
  } else {
    console.log(mensajeDeNoEncontrado);
  }
}

// funcion para filtrar muebles por tipo
function filtrarPorTipo(tipoMueble) {
  return muebles.filter(function (mueble) {
    return mueble.tipo.toLowerCase().startsWith(tipoMueble.toLowerCase());
  });
}

// Filtra los muebles que tienen un precio menor o igual al precio máximo especificado
function filtrarPorPrecioMaximo(precioMaximo) {
  return muebles.filter(function (mueble) {
    return mueble.precio <= precioMaximo;
  });
}

// array para almacenar los muebles
const muebles = [];

// función para agregar muebles al array
function agregarMueble(mueble) {
  muebles.push(mueble);
}

// agregar algunos muebles de ejemplo
agregarMueble(new Mueble(1, "Silla Clasica", "Madera", 1500, 10));
agregarMueble(new Mueble(2, "Mesa Desayuno", "Metal", 3000, 5));
agregarMueble(new Mueble(3, "Sofá Blanc", "Cuero", 18000, 2));
agregarMueble(new Mueble(4, "Silla Moderna", "Madera", 2500, 10));
agregarMueble(new Mueble(5, "Mesa extensible", "Madera", 10000, 5));
agregarMueble(new Mueble(6, "Sofá Charleston", "Cuero", 21000, 2));
agregarMueble(new Mueble(7, "Silla Vintage", "Metal", 2000, 10));
agregarMueble(new Mueble(8, "Mesa Comedor", "Madera", 8000, 5));
agregarMueble(new Mueble(9, "Sofá Retro", "Tela", 15000, 2));

// función para listar los menús de admin o venta
function ListarMenus() {
  let opcion;
  do {
    opcion = prompt(`Seleccione una opción:
1. Menú Administrador
2. Menú Venta de Muebles
0. Salir`);
    switch (opcion) {
      case "1":
        //llama al menu de administrador
        MenuAdministrador();
        break;
      case "2":
        //llama al menu del vendedor
        MenuVentas();
        break;
      case "0":
        alert("Gracias por visitar nuestra tienda. ¡Hasta pronto!");
        break;
      default:
        alert("Opción no válida. Por favor, intente de nuevo.");
    }
  } while (opcion !== "0");
}

// armar el menú para el administrador
function MenuAdministrador() {
  let opcion;
  do {
    opcion = prompt(`Seleccione una opción:
1. Ver todos los muebles
2. Buscar mueble por tipo
3. Filtrar muebles por precio Maximo
4. Actualizar stock de un mueble
5. Actualizar el precio de un mueble
0. Volver al menú principal`);
    switch (opcion) {
      case "1":
        //Lista todos los muebles
        mostrarMuebles();
        break;
      case "2":
        //Filtra por tipo de mueble y muestra resultados
        const tipoMueble = prompt(
          "Ingrese el tipo de mueble a buscar (ej: Silla, Mesa, Sofá):"
        );
        //Muestro los muebles filtrados por tipo o un mensaje si no encuentra
        mostrarResultados(
          filtrarPorTipo(tipoMueble),
          "No se encontraron muebles de ese tipo."
        );
        break;
      case "3":
        //pide el precio maximo y muestra muebles con precio menor o igual al mismo
        const precioMaximo = parseFloat(
          prompt("Ingrese el precio máximo de los muebles a listar:")
        );
        mostrarResultados(
          filtrarPorPrecioMaximo(precioMaximo),
          "No se encontraron muebles dentro de ese rango de precio."
        );
        break;
      case "4":
        //Actualiza el stock de un mueble por ID
        const idMueble = parseInt(
          prompt("Ingrese el ID del mueble para actualizar stock:")
        );
        //pide el nuevo stock
        const nuevoStock = parseInt(prompt("Ingrese el nuevo stock:"));
        //devuelve el primer mueble que coincide con el ID
        const muebleStockAActualizar = muebles.find(
          (mueble) => mueble.id === idMueble
        );
        //si encuentra el mueble, actualiza el stock y muestra la info completa
        if (muebleStockAActualizar) {
          muebleStockAActualizar.setStock(nuevoStock);
          console.log("Stock actualizado:");
          console.log(muebleStockAActualizar.mostrarInfoCompleta());
        } else {
          console.log("No se encontró un mueble con ese ID.");
        }
        break;
      case "5":
        //Actualiza el precio de un mueble por ID
        const idMueblePrecio = parseInt(
          prompt("Ingrese el ID del mueble para actualizar precio:")
        );
        //pide el nuevo precio
        const nuevoPrecio = parseFloat(prompt("Ingrese el nuevo precio:"));
        //devuelve el primer mueble que coincide con el ID
        const mueblePrecioAActualizar = muebles.find(
          (mueble) => mueble.id === idMueblePrecio
        );
        //si encuentra el mueble, actualiza el precio y muestra la info completa
        if (mueblePrecioAActualizar) {
          mueblePrecioAActualizar.setPrecio(nuevoPrecio);
          console.log("Precio actualizado:");
          console.log(mueblePrecioAActualizar.mostrarInfoCompleta());
        } else {
          console.log("No se encontró un mueble con ese ID.");
        }
        break;
      case "0":
        console.log("vuelvo al menu principal");
        break;
      default:
        alert("Opción no válida. Por favor, intente de nuevo.");
    }
  } while (opcion !== "0");
}

//Armar el menú para la venta de muebles
function MenuVentas() {
  let opcion;
  do {
    opcion = prompt(`Seleccione una opción:
    1. Ver todos los muebles
    2. Listar muebles por precio máximo
    3. listar muebles por tipo
    4. Comprar un mueble
    0. Volver al menú principal`);
    switch (opcion) {
      case "1":
        //Lista todos los muebles
        mostrarMuebles();
        break;
      case "2":
        //Pide el precio máximo para filtrar
        const precioMaximo = parseFloat(
          prompt("Ingrese el precio máximo de los muebles a listar:")
        );
        //Muestro los muebles filtrados por precio maximo o un mensaje si no encuentra
        mostrarResultados(
          filtrarPorPrecioMaximo(precioMaximo),
          "No se encontraron muebles dentro de ese rango de precio."
        );
        break;
      case "3":
        //pide el tipo de mueble para filtrar
        const tipoMueble = prompt(
          "Ingrese el tipo de mueble a buscar (ej: Silla, Mesa, Sofá):"
        );
        //Muestro los muebles filtrados por como comienza el tipo o un mensaje si no encuentra
        mostrarResultados(
          filtrarPorTipo(tipoMueble),
          "No se encontraron muebles de ese tipo."
        );
        break;
      case "4":
        //Pide el ID del mueble a comprar
        const idMueble = parseInt(
          prompt("Ingrese el ID del mueble que desea comprar:")
        );
        if (!confirm("Confirma la compra del mueble ID: " + idMueble + "?")) {
          console.log("Compra cancelada!.");
          alert("Compra cancelada!.");
          break;
        }
        //Busca y devuelve el objeto mueble por ID
        const muebleParaComprar = muebles.find(
          (mueble) => mueble.id === idMueble
        );
        //Si encuentra el mueble, verifica stock
        if (muebleParaComprar) {
          if (muebleParaComprar.stock > 0) {
            //Si hay stock, reduce en 1 y muestra detalles de la compra
            muebleParaComprar.setStock(muebleParaComprar.stock - 1);
            console.log("Compra exitosa! Detalles del mueble:");
            alert("Compra exitosa! Detalles del mueble:");
            console.log(muebleParaComprar.mostrarInfoCompleta());
            alert(muebleParaComprar.mostrarInfoVenta());
          } else {
            console.log("Lo sentimos, este mueble está agotado.");
          }
        } else {
          console.log("No se encontró un mueble con ese ID.");
        }
        break;
      case "0":
        console.log("vuelvo al menu principal");
        break;
      default:
        alert("Opción no válida. Por favor, intente de nuevo.");
    }
  } while (opcion !== "0");
}

//ejecuto el menu principal:
ListarMenus();

//Ejecutar menu admin:
//MenuAdministrador();
//Ejecutar menu venta:
//MenuVentas();
