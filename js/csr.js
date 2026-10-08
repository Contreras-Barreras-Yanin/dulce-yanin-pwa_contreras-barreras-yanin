// csr.js — Renderizado en el Cliente (CSR)
// El HTML llega con tarjetas "esqueleto" vacías y este archivo, ya corriendo
// en el navegador, pide catalogo.json y dibuja los productos agrupados por categoría.

// Descripciones cortas de tu menú (se buscan por el id del producto)
const descripciones = {
  1: "Bizcocho suave bañado en tres leches.",
  2: "Pastel de chocolate suave y cremoso.",
  3: "Pastel rojo con crema de queso.",
  4: "Pastel de zanahoria con nuez y especias.",
  5: "Cheesecake cremoso con frutos rojos.",
  6: "Suave bizcocho de vainilla con crema.",
  7: "Brownie de chocolate con trozos de nuez.",
  8: "Pay cremoso con delicioso sabor a limón.",
  9: "Flan suave con caramelo tradicional.",
  10: "Galleta suave con chispas de chocolate.",
  11: "Café intenso de aroma recién hecho.",
  12: "Espresso con leche cremosa y espuma.",
  13: "Bebida cremosa de chocolate caliente.",
  14: "Frappé frío y cremoso con sabor a galleta.",
  15: "Leche cremosa con delicioso sabor a fresa."
};

// 1) Buscamos el contenedor del catálogo que dejamos en index.html
const contenedorCatalogo = document.getElementById("catalogo");

// 2) fetch() pide catalogo.json al servidor (simula una API real)
fetch("catalogo.json")
  .then((respuesta) => {
    if (!respuesta.ok) throw new Error("HTTP " + respuesta.status);
    return respuesta.json(); // convierte el texto en un array de objetos JS
  })
  .then((productos) => {
    // 3) Borramos las tarjetas esqueleto; el contenedor deja de ser rejilla
    //    porque ahora cada categoría trae su propia rejilla
    contenedorCatalogo.innerHTML = "";
    contenedorCatalogo.classList.remove("grid");
    contenedorCatalogo.removeAttribute("aria-busy");
    contenedorCatalogo.removeAttribute("aria-label");

    // Categorías sin repetir, en el orden en que aparecen en catalogo.json
    const categorias = [...new Set(productos.map((p) => p.categoria))];

    categorias.forEach((categoria) => {
      const bloque = document.createElement("div");
      bloque.className = "categoria";

      const titulo = document.createElement("h3");
      titulo.textContent = categoria;

      const rejilla = document.createElement("div");
      rejilla.className = "grid";

      productos
        .filter((producto) => producto.categoria === categoria)
        .forEach((producto) => {
          const tarjeta = document.createElement("div");
          tarjeta.className = "producto";

          tarjeta.innerHTML = `
            <img class="producto__foto" src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
            <strong>${producto.nombre}</strong>
            <p class="descripcion">${descripciones[producto.id] || ""}</p>
            <span class="precio">$${producto.precio} MXN</span>
            <button type="button" data-id="${producto.id}">Agregar</button>
          `;

          rejilla.appendChild(tarjeta);

          // El carrito se crea en el avance 2 (carrito.js). Mientras no exista,
          // el botón no hace nada, pero tampoco marca error.
          tarjeta.querySelector("button").addEventListener("click", () => {
            if (typeof agregarAlCarrito === "function") {
              agregarAlCarrito(producto);
            }
          });
        });

      bloque.appendChild(titulo);
      bloque.appendChild(rejilla);
      contenedorCatalogo.appendChild(bloque);
    });
  })
  .catch((error) => {
    contenedorCatalogo.innerHTML = "<p>No se pudo cargar el catálogo. Intenta más tarde.</p>";
    contenedorCatalogo.removeAttribute("aria-busy");
    contenedorCatalogo.removeAttribute("aria-label");
    console.error("Error al cargar catálogo:", error);
  });