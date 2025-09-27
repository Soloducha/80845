// Copia aquí la definición de la clase Mueble y el array muebles
class Mueble {
  constructor(id, tipo, material, precio, stock) {
    this.id = id;
    this.tipo = tipo;
    this.material = material;
    this.precio = precio;
    this.stock = stock;
  }
}

const muebles = [
  new Mueble(1, "Silla Clasica", "Madera", 4500, 10),
  new Mueble(2, "Mesa Desayuno", "Metal", 13000, 3),
  new Mueble(3, "Sofá Blanc", "Cuero", 180000, 2),
  new Mueble(4, "Silla Moderna", "Madera", 4200, 10),
  new Mueble(5, "Mesa extensible", "Madera", 10000, 5),
  new Mueble(6, "Sofá Charleston", "Cuero", 200000, 2),
  new Mueble(7, "Silla Vintage", "Metal", 5000, 10),
  new Mueble(8, "Mesa Comedor", "Madera", 8000, 4),
  new Mueble(9, "Sofá Retro", "Tela", 120000, 2),
];
// Guardar la lista de muebles en localStorage
localStorage.setItem("muebles", JSON.stringify(muebles));
