
/* script.js - gestión básica de productos, búsqueda, carrusel y carrito usando localStorage */
const PRODUCTS = [
  {id:1,name:'Polera personalizada - Diseño A',price:12000, image:'images/prod1.jpg'},
  {id:2,name:'Taza mágica - Color',price:8000, image:'images/prod2.jpg'},
  {id:3,name:'Almohadón estampado',price:15000, image:'images/prod3.jpg'},
  {id:4,name:'Polera personalizada - Diseño B',price:12500, image:'images/prod4.jpg'},
  {id:5,name:'Lienzo 20x30',price:18000, image:'images/prod5.jpg'},
  {id:6,name:'Set de llaveros',price:6000, image:'images/prod6.jpg'},
];

function qs(sel){return document.querySelector(sel)}
function qsa(sel){return Array.from(document.querySelectorAll(sel))}

function init(){
  renderFeatured();
  renderProductsPage();
  setupSearch();
  setupCarousel();
  updateCartCount();
  setupMobileMenu();
  setupContactForm();
  renderCartPage();
}

function renderFeatured(){
  const el = qs('#featuredProducts');
  if(!el) return;
  const featured = PRODUCTS.slice(0,4);
  el.innerHTML = featured.map(p=>productCardHtml(p)).join('');
  attachAddButtons(el);
}

function renderProductsPage(){
  const el = qs('#productsList');
  if(!el) return;
  el.innerHTML = PRODUCTS.map(p=>productCardHtml(p)).join('');
  attachAddButtons(el);
}

function productCardHtml(p){
  return `<div class="product-card" data-id="${p.id}">
    <img src="${p.image}" alt="${p.name}">
    <h3>${p.name}</h3>
    <p>$ ${p.price.toLocaleString()}</p>
    <div class="product-actions">
      <input class="qty" type="number" min="1" value="1" aria-label="Cantidad">
      <button class="add-btn" data-id="${p.id}">Agregar al carrito</button>
    </div>
  </div>`;
}

function attachAddButtons(container){
  container.querySelectorAll('.add-btn').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const id = Number(btn.dataset.id);
      const card = btn.closest('.product-card');
      const qtyInput = card.querySelector('.qty');
      const qty = Math.max(1, Number(qtyInput.value)||1);
      addToCart(id, qty);
    });
  });
}

function setupSearch(){
  const input = qs('#searchInput');
  if(!input) return;
  input.addEventListener('input', (e)=>{
    const q = e.target.value.toLowerCase().trim();
    const grid = qs('.products-grid');
    if(!grid) return;
    const cards = grid.querySelectorAll('.product-card');
    cards.forEach(c=>{
      const name = c.querySelector('h3').textContent.toLowerCase();
      c.style.display = name.includes(q)?'flex':'none';
    });
  });
}

/* Cart logic */
function getCart(){ return JSON.parse(localStorage.getItem('sublimacart')||'[]') }
function saveCart(c){ localStorage.setItem('sublimacart', JSON.stringify(c)); updateCartCount(); }

function addToCart(id, qty){
  const cart = getCart();
  const item = cart.find(i=>i.id===id);
  if(item) item.qty += qty;
  else cart.push({id, qty});
  saveCart(cart);
  alert('Producto agregado al carrito');
}

function updateCartCount(){
  const countEl = qs('#cart-count');
  if(!countEl) return;
  const cart = getCart();
  const total = cart.reduce((s,i)=>s+i.qty,0);
  countEl.textContent = total;
}

/* Cart page rendering */
function renderCartPage(){
  const container = qs('#cartContents');
  if(!container) return;
  const cart = getCart();
  if(cart.length===0){ container.innerHTML='<p>Tu carrito está vacío.</p>'; qs('#cartSummary').innerHTML=''; return; }
  const rows = cart.map(ci=>{
    const p = PRODUCTS.find(x=>x.id===ci.id);
    const subtotal = p.price * ci.qty;
    return `<div class="cart-row" data-id="${ci.id}">
      <img src="${p.image}" style="height:80px;object-fit:cover;border-radius:8px;margin-right:10px">
      <strong>${p.name}</strong>
      <div>Cantidad: <input type="number" class="cart-qty" value="${ci.qty}" min="1" style="width:70px"></div>
      <div>Precio unitario: $ ${p.price.toLocaleString()}</div>
      <div>Subtotal: $ ${subtotal.toLocaleString()}</div>
      <button class="remove-btn">Eliminar</button>
    </div>`;
  }).join('');
  container.innerHTML = rows;
  attachCartEvents();
  renderCartSummary();
}

function attachCartEvents(){
  qsa('.remove-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = Number(btn.closest('.cart-row').dataset.id);
      let cart = getCart();
      cart = cart.filter(i=>i.id!==id);
      saveCart(cart);
      renderCartPage();
    });
  });
  qsa('.cart-qty').forEach(inp=>{
    inp.addEventListener('change', ()=>{
      const row = inp.closest('.cart-row');
      const id = Number(row.dataset.id);
      const val = Math.max(1, Number(inp.value)||1);
      const cart = getCart();
      const item = cart.find(i=>i.id===id);
      if(item){ item.qty = val; saveCart(cart); renderCartPage(); }
    });
  });
}

function renderCartSummary(){
  const sumEl = qs('#cartSummary');
  if(!sumEl) return;
  const cart = getCart();
  const total = cart.reduce((s,i)=>{
    const p = PRODUCTS.find(x=>x.id===i.id);
    return s + p.price * i.qty;
  },0);
  sumEl.innerHTML = `<h3>Total: $ ${total.toLocaleString()}</h3>
    <button id="checkoutBtn">Proceder a pagar</button>`;
  qs('#checkoutBtn').addEventListener('click', ()=> alert('Aquí integrarías Webpay o formularios de pago.'));
}

/* Carousel */
function setupCarousel(){
  const track = qs('.carousel-track');
  if(!track) return;
  let index = 0;
  const items = track.children;
  const total = items.length;
  const prev = qs('#prevBtn'), next = qs('#nextBtn');
  function show(i){ track.style.transform = `translateX(${-i*100}%)`; index = i; }
  prev?.addEventListener('click', ()=> show((index-1+total)%total));
  next?.addEventListener('click', ()=> show((index+1)%total));
  // autoplay
  setInterval(()=> show((index+1)%total), 4500);
}

/* Mobile menu */
function setupMobileMenu(){
  const btn = qs('#mobileMenuBtn') || qs('#mobileMenuBtn2');
  if(!btn) return;
  btn.addEventListener('click', ()=>{
    const nav = document.querySelector('.main-nav');
    if(!nav) return;
    nav.style.display = nav.style.display==='block'?'none':'block';
  });
}

/* Contact form - demo */
function setupContactForm(){
  const form = qs('#contactForm');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    alert('Gracias! Mensaje enviado (demo).');
    form.reset();
  });
}

/* Init on DOM ready */
document.addEventListener('DOMContentLoaded', init);
