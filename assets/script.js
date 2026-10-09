
const MENU = {
  "Classic Beef Burger": 650,
  "Garden Fresh Bowl": 480,
  "Grilled Chicken Plate": 850,
  "Loaded Pizza": 950,
  "Crispy Fries": 250,
  "Fresh Cooler": 180
};

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("steveCart") || "{}");
  } catch {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem("steveCart", JSON.stringify(cart));
  updateCartBadges();
  renderCart();
}

function addToCart(name, price) {
  // Use the known menu price instead of a price passed by the page.
  if (!Object.hasOwn(MENU, name)) return;

  const cart = getCart();

  if (!cart[name]) {
    cart[name] = { price: MENU[name], qty: 0 };
  }

  cart[name].qty++;
  saveCart(cart);
  alert(name + " added to your order.");
}

function changeQty(name, amount) {
  const cart = getCart();
  if (!cart[name]) return;

  cart[name].qty += amount;

  if (cart[name].qty <= 0) {
    delete cart[name];
  }

  saveCart(cart);
}

function updateCartBadges() {
  const cart = getCart();
  const count = Object.values(cart)
    .reduce((sum, item) => sum + item.qty, 0);

  document.querySelectorAll(".cart-count")
    .forEach(element => element.textContent = count);
}

function renderCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  const cart = getCart();
  const items = Object.entries(cart);
  const totalElement = document.getElementById("cart-total");

  if (items.length === 0) {
    container.innerHTML =
      '<p class="empty-cart">Your basket is empty. Visit the menu to add meals.</p>';

    totalElement.textContent = "KSh 0";
    return;
  }

  let total = 0;

  container.replaceChildren();

  items.forEach(([name, item]) => {
    const row = document.createElement("div");
    row.className = "cart-row";

    const description = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = name;

    const price = document.createElement("small");
    price.textContent = `KSh ${item.price.toLocaleString()} each`;

    description.append(title, price);

    const controls = document.createElement("div");
    controls.className = "qty-controls";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.textContent = "−";
    minus.setAttribute("aria-label", `Remove one ${name}`);
    minus.addEventListener("click", () => changeQty(name, -1));

    const quantity = document.createElement("span");
    quantity.textContent = item.qty;

    const plus = document.createElement("button");
    plus.type = "button";
    plus.textContent = "+";
    plus.setAttribute("aria-label", `Add one ${name}`);
    plus.addEventListener("click", () => changeQty(name, 1));

    controls.append(minus, quantity, plus);

    const subtotal = document.createElement("strong");
    subtotal.textContent =
      `KSh ${(item.price * item.qty).toLocaleString()}`;

    row.append(description, controls, subtotal);
    container.appendChild(row);

    total += item.price * item.qty;
  });

  totalElement.textContent = `KSh ${total.toLocaleString()}`;
}

function toggleNav() {
  document.getElementById("nav")?.classList.toggle("open");
}

function contactSubmit(event) {
  event.preventDefault();

  const message = document.getElementById("contact-message");
  message.hidden = false;
  message.textContent =
    "This is a demo form. Connect it to a backend or email service to receive messages.";

  event.target.reset();
}

async function submitOrder(event) {
  event.preventDefault();

  const cart = getCart();
  const message = document.getElementById("checkout-message");

  if (Object.keys(cart).length === 0) {
    message.hidden = false;
    message.textContent = "Your basket is empty. Add meals before checking out.";
    return;
  }

  message.hidden = false;
  message.textContent =
    "Your order is ready for the payment step. Configure and connect the server-side Daraja API before requesting M-Pesa payment.";
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadges();
  renderCart();

  document.querySelectorAll("#year").forEach(element => {
    element.textContent = new Date().getFullYear();
  });
});