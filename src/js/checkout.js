import { loadHeaderFooter } from "/js/utils.mjs";
import { readCart, subtotal, updateCartBadge, clearCart } from "/js/cart-process.mjs";
import { fmtMoney, buildOrder } from "/js/checkout-process.mjs";

document.addEventListener("DOMContentLoaded", init);

async function init() {
  await loadHeaderFooter();
  updateCartBadge();
  renderSummary();
  const form = document.getElementById("checkout-form");
  form?.addEventListener("submit", onSubmit);
}

function renderSummary() {
  const items = readCart();
  const box = document.getElementById("summary-items");
  const sub = document.getElementById("summary-subtotal");

  if (!items.length) {
    box.innerHTML = `<p class="muted">Your cart is empty.</p>`;
    sub.textContent = fmtMoney(0);
    return;
  }

  box.innerHTML = items.map(
    (i) => `
      <div class="summary-item">
        <img src="${i.imageUrl}" alt="${i.name}" />
        <div class="info">
          <div>${i.name}</div>
          <small class="muted">Qty ${i.quantity} × ${fmtMoney(i.price)}</small>
        </div>
        <div class="line">${fmtMoney((i.quantity || 1) * (i.price || 0))}</div>
      </div>`
  ).join("");

  sub.textContent = fmtMoney(subtotal(items));
}

async function onSubmit(e) {
  e.preventDefault();
  const form = e.currentTarget;
  hideMsg();

  let order;
  try {
    order = buildOrder(form);
  } catch (err) {
    showError(err.messages?.join(" • ") || err.message);
    return;
  }

  const btn = document.getElementById("place-order");
  btn.disabled = true;

  try {
    // 🔹 Simulate sending to server locally
    const { id } = await fakeSubmitOrder(order);

    // Clear cart, update badge, and go to confirmation
    clearCart();
    updateCartBadge();

    // Keep the last order id handy for the confirmation page
    sessionStorage.setItem("lastOrderId", id);

    window.location.href = `/checkout/confirmation.html?orderId=${encodeURIComponent(id)}`;
  } catch (err) {
    showError(err.message || "Checkout failed");
  } finally {
    btn.disabled = false;
  }
}

// ----- Local “server” -----
async function fakeSubmitOrder(order) {
  // Simulate latency
  await new Promise((r) => setTimeout(r, 500));

  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  const id = order.id || `ord_${Date.now()}`;
  const saved = { ...order, id, status: "CONFIRMED" };

  orders.push(saved);
  localStorage.setItem("orders", JSON.stringify(orders));

  return { id };
}

function showError(msg) {
  const p = document.getElementById("checkout-error");
  p.textContent = msg;
  p.style.display = "block";
  document.getElementById("checkout-success").style.display = "none";
}

function showSuccess(msg) {
  const p = document.getElementById("checkout-success");
  p.textContent = msg;
  p.style.display = "block";
  document.getElementById("checkout-error").style.display = "none";
}

function hideMsg() {
  document.getElementById("checkout-error").style.display = "none";
  document.getElementById("checkout-success").style.display = "none";
}
