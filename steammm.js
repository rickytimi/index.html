const products = [
  { id: 1, name: "Arduino uno r3 with cable", price: 1500, img: "ardduno urno board.jpg", desc: "Complete starter kit for Arduino projects 🎨— modules, sensors and guide." },
  { id: 2, name: "HiWATT 9V", price: 5500, img: "hiwatt.jpg", desc: "9V battery, 1 pack. High durability and consistent performance." },
  { id: 3, name: "5V DC Motor", price: 4000, img: "motor-5v.jpg", desc: "Compact high-speed brushed DC motor." },
  { id: 4, name: "12V DC Motor", price: 3000, img: "motor-12v.jpg", desc: "12V motor — higher torque." },
  { id: 5, name: "VIPER53 LCD power chip", price: 3000, img: "viper.jpg", desc: " for experiments." },
  { id: 6, name: "Bread board", price: 1700, img: "400 hole mini bread board.jpg", desc: "400 hole mini breadboard for prototyping electronic circuits." },
  { id: 7, name: "LCD display", price: 6000, img: "LCD displa.jpg", desc: "hjetjnbahnj" },
  { id: 8, name: "Capacitors", price: 6000, img: "OIcapacitor.jpg", desc: "hjetjnbahnj" },
  { id: 9, name: "Black Tape", price: 6000, img: "black tape.jpg", desc: "hjetjnbahnj" },
  { id: 10, name: "DIY STEM Soundwave", price: 6000, img: "diy sound system.jpg", desc: "hjetjnbahnj" },
  { id: 11, name: "5v laser Diode", price: 1200, img: "diodes.jpg", desc: "5v laser diode" },
  { id: 12, name: "1N5399 1.5A 1000V diode", price: 150, img: "IMG-20251110-WA0002[1].jpg", desc: "hfgfhv"},
  { id: 13, name: "Glue gun", price: 1200, img: "glue gun.jpg", desc: "5v laser diode" },
  { id: 14, name: "Gun stick or candle wax", price: 1200, img: "candle gum stick.jpg", desc: "5v laser diode" },
  { id: 15, name: "Soldering Iron", price: 1200, img: "soldering iron.jpg", desc: "5v laser diode" },
  { id: 16, name: "Lead solder", price: 1200, img: "lead solder.jpg", desc: "" },
  { id: 17, name: "Cutter", price: 1200, img: "cutter.jpg", desc: "5v laser diode" },
  { id: 18, name: "Scissors", price: 1200, img: "scissors.jpg", desc: "5v laser diode" },
  { id: 19, name: "VIPER53 LCD power chip", price: 3000, img: "", desc: "5v laser diode" },
  { id: 20, name: "Blue LCD 1602", price: 3500, img: "cutter.jpg", desc: "5v laser diode" },
  { id: 21, name: "Arduino Nano type C", price: 8500, img: "cutter.jpg", desc: "5v laser diode" },
  { id: 22, name: "Serial LCD", price: 6000, img: "cutter.jpg", desc: "5v laser diode" },
  { id: 23, name: "Bread Board MB102", price: 3000, img: "bread board mb102.jpg", desc: "5v laser diode" },
  { id: 24, name: "1N5822 diode", price: 200, img: "black tape.jpg", desc: "fr kits experiment" },
];

const cartKey = "steam_kits_cart_v1";
const ordersKey = "steam_kits_orders_v1";
let cart = JSON.parse(localStorage.getItem(cartKey) || "[]");

// currency formatting (Naira)
function formatCurrency(value){
  return Number(value).toLocaleString('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 2 });
}

// ...existing code...
// DOM refs
const productsEl = document.getElementById("products");
const productModal = document.getElementById("product-modal");
const modalImg = document.getElementById("modal-img");
const modalName = document.getElementById("modal-name");
const modalDesc = document.getElementById("modal-desc");
const modalPrice = document.getElementById("modal-price");
const modalQty = document.getElementById("modal-qty");
const modalAdd = document.getElementById("modal-add");
const closeModalBtn = document.getElementById("close-modal");

// changed: allow reassign so we can create a floating cart button if missing
let cartBtn = document.getElementById("view-cart-btn");
const cartEl = document.getElementById("cart");
let cartItemsEl = document.getElementById("cart-items");
let cartCountEl = document.getElementById("cart-count");
const subtotalEl = document.getElementById("subtotal");
const deliveryFeeEl = document.getElementById("delivery-fee");
const totalEl = document.getElementById("total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeCartBtn = document.getElementById("close-cart-btn");

// ...existing code...
// add these DOM refs (paste after your other DOM refs)
const searchInput = document.getElementById("search-input");
const loginBtn = document.getElementById("login-btn");
const userDisplay = document.getElementById("user-display");
const loginModal = document.getElementById("login-modal");
const loginForm = document.getElementById("login-form");
const closeLogin = document.getElementById("close-login");
// ...existing code...

// ensure there is a floating cart button at top-right if page doesn't provide one
if (!cartBtn) {
  const floatBtn = document.createElement("button");
  floatBtn.id = "view-cart-btn";
  floatBtn.className = "floating-cart";
  floatBtn.innerHTML = '🛒 <span id="cart-count">0</span>';
  Object.assign(floatBtn.style, {
    position: "fixed",
    right: "16px",
    top: "16px",
    zIndex: 9999,
    padding: "0.5rem 0.8rem",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    background: "#fff",
    border: "1px solid #ddd",
    cursor: "pointer"
  });
  document.body.appendChild(floatBtn);
  // update refs to point to created elements
  cartBtn = document.getElementById("view-cart-btn");
  cartCountEl = document.getElementById("cart-count");
}

// ...existing code...

// search: filter products by name/description
function renderProducts(query = "") {
  const q = String(query || "").trim().toLowerCase();
  productsEl.innerHTML = "";
  products
    .filter((p) => {
      if (!q) return true;
      return (p.name + " " + (p.desc || "")).toLowerCase().includes(q);
    })
    .forEach((p) => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h4>${p.name}</h4>
      <p class="desc">${p.desc || ""}</p>
      <p class="price">${formatCurrency(p.price)}</p>
      <div style="display:flex;gap:.5rem;justify-content:center">
        <button class="view" data-id="${p.id}">View</button>
        <button class="add" data-id="${p.id}">Add</button>
      </div>
    `;
      productsEl.appendChild(card);
    });

  // handlers
  productsEl.querySelectorAll("button.view").forEach((b) => {
    b.addEventListener("click", () => openModal(Number(b.dataset.id)));
  });
  productsEl.querySelectorAll("button.add").forEach((b) => {
    b.addEventListener("click", () => addToCart(Number(b.dataset.id)));
  });
}

// wire search input (safe if element missing)
searchInput?.addEventListener("input", () => renderProducts(searchInput.value));

// ...existing code...

// remove duplicate renderProducts definition (the second one was deleted)

// UI toggles
cartBtn?.addEventListener("click", () => {
  cartEl?.classList.toggle("hidden");
  updateCartUI();
});
closeCartBtn?.addEventListener("click", () => cartEl?.classList.add("hidden"));
checkoutBtn?.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }
  cartEl?.classList.add("hidden");
  checkoutEl?.classList.remove("hidden");
  refreshSummary();
});

// ...existing code...

// initial render (single call)
updateAuthUI();
renderProducts();
updateCartUI();
// ...existing code...

// open/close side menu
function openSideMenu(){
  sideMenu.classList.remove("hidden");
  sideMenu.setAttribute("aria-hidden", "false");
}
function closeSideMenu(){
  sideMenu.classList.add("hidden");
  sideMenu.setAttribute("aria-hidden", "true");
}
menuBtn?.addEventListener("click", openSideMenu);
sideClose?.addEventListener("click", closeSideMenu);

// handle actions from side menu buttons
document.querySelectorAll(".side-action").forEach(btn=>{
  btn.addEventListener("click", (e)=>{
    const action = btn.dataset.action;
    closeSideMenu();

    if(action === "open-products"){
      // scroll to products grid
      productsEl.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if(action === "open-cart"){
      // open cart panel
      cartEl.classList.remove("hidden");
      updateCartUI();
    } else if(action === "open-orders"){
      // show recent orders panel (if available)
      const ordersPanel = document.getElementById("orders");
      if(ordersPanel) ordersPanel.classList.remove("hidden");
    } else if(action === "open-login"){
      // open login modal (reuse existing login modal)
      loginModal.classList.remove("hidden");
    }
  });
});

// close side menu when clicking outside it (optional)
document.addEventListener("click", (e)=>{
  if(sideMenu && !sideMenu.classList.contains("hidden")){
    const withinMenu = sideMenu.contains(e.target) || menuBtn.contains(e.target);
    if(!withinMenu) closeSideMenu();
  }
});

// ...existing code...
// simple auth (localStorage demo)
const userKey = "steam_kits_user";
function getCurrentUser(){ return JSON.parse(localStorage.getItem(userKey) || "null"); }
function setCurrentUser(u){ localStorage.setItem(userKey, JSON.stringify(u)); updateAuthUI(); }
function clearUser(){ localStorage.removeItem(userKey); updateAuthUI(); }

function updateAuthUI(){
  const user = getCurrentUser();
  if(user){
    userDisplay.textContent = `Hi, ${user.name}`;
    loginBtn.textContent = "Logout";
  } else {
    userDisplay.textContent = "";
    loginBtn.textContent = "Login";
  }
}

// login modal handlers
loginBtn.addEventListener("click", () => {
  const user = getCurrentUser();
  if(user){ clearUser(); return; } // logout
  loginModal.classList.remove("hidden");
});
closeLogin.addEventListener("click", ()=> loginModal.classList.add("hidden"));
loginForm.addEventListener("submit", e=>{
  e.preventDefault();
  const fd = new FormData(loginForm);
  const user = { name: fd.get("name"), contact: fd.get("contact") };
  setCurrentUser(user);
  loginModal.classList.add("hidden");
  loginForm.reset();
});

// search: filter products by name/description
function renderProducts(query = ""){
  const q = String(query || "").trim().toLowerCase();
  productsEl.innerHTML = "";
  products.filter(p => {
    if(!q) return true;
    return (p.name + " " + (p.desc || "")).toLowerCase().includes(q);
  }).forEach(p=>{
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h4>${p.name}</h4>
      <p class="desc">${p.desc || ""}</p>
      <p class="price">${formatCurrency(p.price)}</p>
      <div style="display:flex;gap:.5rem;justify-content:center">
        <button class="view" data-id="${p.id}">View</button>
        <button class="add" data-id="${p.id}">Add</button>
      </div>
    `;
    productsEl.appendChild(card);
  });

  // reattach handlers (same as before)
  productsEl.querySelectorAll("button.view").forEach(b=>{
    b.addEventListener("click", ()=> openModal(Number(b.dataset.id)));
  });
  productsEl.querySelectorAll("button.add").forEach(b=>{
    b.addEventListener("click", ()=> addToCart(Number(b.dataset.id)));
  });
}

// wire search input
searchInput.addEventListener("input", () => renderProducts(searchInput.value));

// run UI init
updateAuthUI();
renderProducts(); // initial render with no filter

// ...existing code...
// render grid
function renderProducts(){
  productsEl.innerHTML = "";
  products.forEach(p=>{
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h4>${p.name}</h4>
      <p class="desc">${p.desc}</p>
      <p class="price">${formatCurrency(p.price)}</p>
      <div style="display:flex;gap:.5rem;justify-content:center">
        <button class="view" data-id="${p.id}">View</button>
        <button class="add" data-id="${p.id}">Add</button>
      </div>
    `;
    productsEl.appendChild(card);
  });

  productsEl.querySelectorAll("button.view").forEach(b=>{
    b.addEventListener("click", ()=> openModal(Number(b.dataset.id)));
  });
  productsEl.querySelectorAll("button.add").forEach(b=>{
    b.addEventListener("click", ()=> addToCart(Number(b.dataset.id)));
  });
}

// modal
let activeProduct = null;
function openModal(id){
  activeProduct = products.find(p=>p.id===id);
  if(!activeProduct) return;
  modalImg.src = activeProduct.img;
  modalName.textContent = activeProduct.name;
  modalDesc.textContent = activeProduct.desc;
  modalPrice.textContent = formatCurrency(activeProduct.price);
  modalQty.value = 1;
  productModal.classList.remove("hidden");
}
closeModalBtn.addEventListener("click", ()=> productModal.classList.add("hidden"));

// cart helpers
function saveCart(){ localStorage.setItem(cartKey, JSON.stringify(cart)); updateCartUI(); }
function addToCart(id, qty = 1){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  const existing = cart.find(i=>i.id===id);
  if(existing) existing.qty += qty;
  else cart.push({ id:p.id, name:p.name, price:p.price, qty:qty });
  saveCart();
}
modalAdd.addEventListener("click", ()=>{
  if(!activeProduct) return;
  const q = Math.max(1, Number(modalQty.value) || 1);
  addToCart(activeProduct.id, q);
  productModal.classList.add("hidden");
});

function removeFromCart(id){
  cart = cart.filter(i=>i.id !== id);
  saveCart();
}
function changeQty(id, delta){
  const it = cart.find(i=>i.id===id);
  if(!it) return;
  it.qty += delta;
  if(it.qty < 1) removeFromCart(id);
  saveCart();
}
function calcSubtotal(){ return cart.reduce((s,i)=>s + i.price * i.qty, 0); }

function updateCartUI(){
  cartCountEl.textContent = cart.reduce((s,i)=>s+i.qty,0);
  cartItemsEl.innerHTML = "";
  cart.forEach(item=>{
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name} x${item.qty}</span>
      <span>
        ${formatCurrency(item.price*item.qty)}
        <small class="action" data-id="${item.id}" data-op="dec">−</small>
        <small class="action" data-id="${item.id}" data-op="inc">+</small>
        <small class="action remove" data-id="${item.id}">Remove</small>
      </span>
    `;
    cartItemsEl.appendChild(li);
  });

  const sub = calcSubtotal();
  const fee = Number(deliverySelect?.selectedOptions?.[0]?.dataset?.fee || 0);
  subtotalEl.textContent = formatCurrency(sub);
  deliveryFeeEl.textContent = formatCurrency(fee);
  totalEl.textContent = formatCurrency(sub + fee);

  cartItemsEl.querySelectorAll(".action").forEach(a=>{
    a.addEventListener("click", ()=> {
      const id = Number(a.dataset.id);
      if(a.dataset.op === "dec") changeQty(id, -1);
      else if(a.dataset.op === "inc") changeQty(id, +1);
      else if(a.classList.contains("remove")) removeFromCart(id);
    });
  });
}

// UI toggles
cartBtn.addEventListener("click", ()=> { cartEl.classList.toggle("hidden"); updateCartUI(); });
closeCartBtn.addEventListener("click", ()=> cartEl.classList.add("hidden"));
checkoutBtn.addEventListener("click", ()=> {
  if(cart.length === 0){ alert("Cart is empty"); return; }
  cartEl.classList.add("hidden");
  checkoutEl.classList.remove("hidden");
  refreshSummary();
});
cancelCheckout.addEventListener("click", ()=> checkoutEl.classList.add("hidden"));

deliverySelect.addEventListener("change", refreshSummary);
function refreshSummary(){
  const sub = calcSubtotal();
  const fee = Number(deliverySelect.selectedOptions[0].dataset.fee || 0);
  summarySub.textContent = formatCurrency(sub);
  summaryDel.textContent = formatCurrency(fee);
  summaryTotal.textContent = formatCurrency(sub + fee);
}

// checkout handling (local only)
checkoutForm.addEventListener("submit", e=>{
  e.preventDefault();
  if(cart.length === 0){ alert("Cart is empty"); return; }
  const form = new FormData(checkoutForm);
  const order = {
    id: Date.now(),
    customer: { name: form.get("name"), phone: form.get("phone"), address: form.get("address"), city: form.get("city") },
    items: cart,
    delivery: form.get("delivery"),
    deliveryFee: Number(checkoutForm.delivery.selectedOptions[0].dataset.fee || 0),
    subtotal: calcSubtotal(),
    total: calcSubtotal() + Number(checkoutForm.delivery.selectedOptions[0].dataset.fee || 0),
    createdAt: new Date().toISOString()
  };
  // save to localStorage (demo)
  const orders = JSON.parse(localStorage.getItem(ordersKey) || "[]");
  orders.unshift(order);
  localStorage.setItem(ordersKey, JSON.stringify(orders));

  // clear cart
  cart = [];
  saveCart();
  checkoutEl.classList.add("hidden");
  alert("Order placed. We will contact you to arrange delivery.");
});

// initial render
renderProducts();
updateCartUI();