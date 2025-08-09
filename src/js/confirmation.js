import { loadHeaderFooter } from "/js/utils.mjs";
import { fmtMoney } from "/js/checkout-process.mjs";
import { updateCartBadge } from "/js/cart-process.mjs";

document.addEventListener("DOMContentLoaded", init);

async function init() {
  await loadHeaderFooter();
  updateCartBadge(); // should be 0 after checkout

  const params = new URL(location.href).searchParams;
  const id = params.get("orderId") || sessionStorage.getItem("lastOrderId");
  const idEl = document.getElementById("order-id");
  idEl.textContent = id || "N/A";

  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  const order = orders.find((o) => o.id === id);

  const itemsBox = document.getElementById("order-items");
  const totalEl = document.getElementById("order-total");

  if (!order) {
    itemsBox.innerHTML = `<p class="muted">Order details not found.</p>`;
    totalEl.textContent = fmtMoney(0);
    return;
  }

  itemsBox.innerHTML = order.items.map(
    (i) => `
      <div class="summary-item">
        <img src="${i.imageUrl}" alt="${i.name}" />
        <div class="info">
          <div>${i.name}</div>
          <small class="muted">Qty ${i.quantity} × ${fmtMoney(i.price)}</small>
        </div>
        <div class="line">${fmtMoney(i.quantity * i.price)}</div>
      </div>`
  ).join("");

  totalEl.textContent = fmtMoney(order.totals?.grandTotal ?? order.totals?.subtotal ?? 0);
}
