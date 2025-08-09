import { loadHeaderFooter } from "/js/utils.mjs";
import {
  fmtMoney,
  readCart,
  writeCart,
  changeQty,
  setQty,
  removeItem,
  clearCart,
  subtotal,
  updateCartBadge,
} from "/js/cart-process.mjs";

function rowTemplate(p, idx) {
  return `
    <article class="cart-item" data-idx="${idx}">
      <img src="${p.imageUrl}" alt="${p.name}" />
      <div class="info">
        <h3>${p.name}</h3>
        <p class="muted">Brand: ${p.Brand ?? "-"}</p>
        <div class="price">${fmtMoney(p.price)}</div>
        <div class="qty">
          <button class="dec" aria-label="decrease">−</button>
          <input class="qty-input" type="number" min="1" value="${p.quantity || 1}" />
          <button class="inc" aria-label="increase">+</button>
        </div>
        <button class="remove linklike">Remove</button>
      </div>
      <div class="line-total">${fmtMoney((p.quantity || 1) * (p.price || 0))}</div>
    </article>`;
}

function renderCart() {
  const container = document.getElementById("cart-container");
  const items = readCart();

  if (!items.length) {
    container.innerHTML = `
      <div class="cart-empty">
        <p>Your cart is empty.</p>
        <a class="btn" href="/index.html">Continue shopping</a>
      </div>`;
    document.getElementById("cart-subtotal").textContent = fmtMoney(0);
    updateCartBadge(items);
    return;
  }

  container.innerHTML = `<div class="cart-list">
    ${items.map((p, idx) => rowTemplate(p, idx)).join("")}
  </div>`;

  // wire per-row actions
  container.querySelectorAll(".cart-item").forEach((el) => {
    const idx = Number(el.dataset.idx);
    el.querySelector(".inc").addEventListener("click", () => {
      changeQty(idx, +1);
      renderCart();
    });
    el.querySelector(".dec").addEventListener("click", () => {
      changeQty(idx, -1);
      renderCart();
    });
    el.querySelector(".qty-input").addEventListener("change", (e) => {
      setQty(idx, Number(e.target.value || 1));
      renderCart();
    });
    el.querySelector(".remove").addEventListener("click", () => {
      removeItem(idx);
      renderCart();
    });
  });

  // totals + badge
  document.getElementById("cart-subtotal").textContent = fmtMoney(subtotal(items));
  updateCartBadge(items);
}

function wireSummaryButtons() {
  const clearBtn = document.getElementById("clear-cart");
  if (clearBtn) clearBtn.addEventListener("click", () => { clearCart(); renderCart(); });

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) checkoutBtn.addEventListener("click", () => {
    window.location.href = "/checkout/checkout.html";
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();     // ensure header (badge) is in DOM
  updateCartBadge();            // reflect existing cart immediately
  renderCart();
  wireSummaryButtons();
});

// Cross-tab sync
window.addEventListener("storage", (e) => {
  if (e.key === "cart") {
    updateCartBadge();
    renderCart();
  }
});
