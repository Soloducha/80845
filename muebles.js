// prompt para ingresar datos y dar bienvenida
const nomyape = prompt("Ingrese su nombre y apellido:");
alert(`Bienvenido/a ${nomyape} a nuestra tienda de muebles!`);
console.log("Bienvenido/a " + nomyape + " a nuestra tienda de muebles!");

// clase para crear objetos muebles
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
  setStock(nuevoStock) {
    this.stock = nuevoStock;
  }
}

// función para mostrar todos los muebles
function mostrarMuebles() {
  muebles.forEach((mueble) => {
    console.log(mueble.mostrarInfoCompleta());
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
agregarMueble(new Mueble(5, "Mesa extensible", "Madera", 5000, 5));
agregarMueble(new Mueble(6, "Sofá Charleston", "Cuero", 21000, 2));
agregarMueble(new Mueble(7, "Silla Vintage", "Metal", 2000, 10));
agregarMueble(new Mueble(8, "Mesa Comedor", "Madera", 8000, 5));
agregarMueble(new Mueble(9, "Sofá Retro", "Tela", 15000, 2));

function Menu() {
  let opcion;
  do {
    opcion = prompt(`Seleccione una opción:
1. Ver todos los muebles
2. Buscar mueble por tipo
3. Filtrar muebles por precio
4. Actualizar stock de un mueble
5. Salir`);
    switch (opcion) {
      case "1":
        mostrarMuebles();
        break;
      case "2":
        const tipoBusqueda = prompt(
          "Ingrese el tipo de mueble a buscar (e.g., Silla, Mesa, Sofá):"
        );
        const resultadosBusqueda = muebles.filter(
          (mueble) => mueble.tipo.toLowerCase() === tipoBusqueda.toLowerCase()
        );
        if (resultadosBusqueda.length > 0) {
          resultadosBusqueda.forEach((mueble) =>
            console.log(mueble.mostrarInfoCompleta())
          );
        } else {
          console.log("No se encontraron muebles de ese tipo.");
        }
        break;
      case "3":
        const precioMaximo = parseFloat(prompt("Ingrese el precio máximo:"));
        const resultadosFiltro = muebles.filter(
          (mueble) => mueble.precio <= precioMaximo
        );
        if (resultadosFiltro.length > 0) {
          resultadosFiltro.forEach((mueble) =>
            console.log(mueble.mostrarInfoCompleta())
          );
        } else {
          console.log(
            "No se encontraron muebles dentro de ese rango de precio."
          );
        }
        break;
      case "4":
        const idMueble = parseInt(
          prompt("Ingrese el ID del mueble para actualizar stock:")
        );
        const nuevoStock = parseInt(prompt("Ingrese el nuevo stock:"));
        const muebleParaActualizar = muebles.find(
          (mueble) => mueble.id === idMueble
        );
        if (muebleParaActualizar) {
          muebleParaActualizar.setStock(nuevoStock);
          console.log("Stock actualizado:");
          console.log(muebleParaActualizar.mostrarInfoCompleta());
        } else {
          console.log("No se encontró un mueble con ese ID.");
        }
        break;
      case "5":
        alert("Gracias por visitar nuestra tienda. ¡Hasta pronto!");

        break;
      default:
        alert("Opción no válida. Por favor, intente de nuevo.");
    }
  } while (opcion !== "5");
}

Menu();
