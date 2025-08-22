let carrito = [];
let total = 0;

function agregarAlCarrito(nombre, precio) {
  carrito.push({ nombre, precio });
  total += precio;
  actualizarCarrito();
}

function actualizarCarrito() {
  const lista = document.getElementById("carrito-items");
  const totalTexto = document.getElementById("carrito-total");
  const contador = document.getElementById("cart-count");

  lista.innerHTML = "";
  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} - $${item.precio}`;
    lista.appendChild(li);
  });

  totalTexto.textContent = `Total: $${total}`;
  contador.textContent = carrito.length;
}

function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("active");
}