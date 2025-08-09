import { loadHeaderFooter } from "/js/utils.mjs";
import { readCart, subtotal, updateCartBadge, clearCart } from "/js/cart-process.mjs";
import { fmtMoney, buildOrder } from "/js/checkout-process.mjs";

document.addEventListener("DOMContentLoaded", init);

let latestRates = [];
let chosenRate = null;

async function init() {
  await loadHeaderFooter();
  updateCartBadge();
  renderSummary();
  hookShippingUI();

  const form = document.getElementById("checkout-form");
  form?.addEventListener("submit", onSubmit);
}

function hookShippingUI() {
  const btn = document.getElementById("get-rates");
  if (btn) btn.addEventListener("click", handleGetRates);
}

function renderSummary() {
  const items = readCart();
  const box = document.getElementById("summary-items");
  const sub = document.getElementById("summary-subtotal");
  const shipEl = document.getElementById("summary-shipping");
  const totalEl = document.getElementById("summary-total");

  if (!items.length) {
    if (box) box.innerHTML = `<p class="muted">Your cart is empty.</p>`;
    if (sub) sub.textContent = fmtMoney(0);
    if (shipEl) shipEl.textContent = fmtMoney(0);
    if (totalEl) totalEl.textContent = fmtMoney(0);
    return;
  }

  if (box) {
    box.innerHTML = items
      .map(
        (i) => `
        <div class="summary-item">
          <img src="${i.imageUrl}" alt="${i.name}" />
          <div class="info">
            <div>${i.name}</div>
            <small class="muted">Qty ${i.quantity} × ${fmtMoney(i.price ?? i.FinalPrice ?? 0)}</small>
          </div>
          <div class="line">${fmtMoney((i.quantity || 1) * (i.price ?? i.FinalPrice ?? 0))}</div>
        </div>`
      )
      .join("");
  }

  const s = subtotal(items);
  if (sub) sub.textContent = fmtMoney(s);
  // initialize shipping/total until user picks a rate
  if (shipEl) shipEl.textContent = fmtMoney(chosenRate ? Number(chosenRate.amount) : 0);
  if (totalEl) totalEl.textContent = fmtMoney(s + (chosenRate ? Number(chosenRate.amount) : 0));
}

function updateTotalsWithRate() {
  const items = readCart();
  const s = subtotal(items);
  const shipEl = document.getElementById("summary-shipping");
  const totalEl = document.getElementById("summary-total");
  const shipping = chosenRate ? Number(chosenRate.amount) : 0;

  if (shipEl) shipEl.textContent = fmtMoney(shipping);
  if (totalEl) totalEl.textContent = fmtMoney(s + shipping);
}

async function handleGetRates() {
  hideMsg();
  const box = document.getElementById("shipping-options");
  if (box) box.textContent = "Loading rates...";

  try {
    const to = readToAddressFromForm();
    // minimal guard (server will also validate)
    if (!to.street1 || !to.city || !to.state || !to.zip) {
      throw new Error("Please complete the Shipping Address first.");
    }

    const resp = await fetch("/api/shipping/rates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to }),
    });

    if (!resp.ok) {
      const msg = await resp.text().catch(() => "");
      throw new Error(`Failed to fetch rates ${resp.status}: ${msg}`);
    }

    const data = await resp.json();
    latestRates = data?.rates || [];
    renderRates(latestRates);
  } catch (err) {
    console.error(err);
    showError(err.message || "Could not load shipping rates.");
    if (box) box.textContent = "Could not load shipping rates.";
  }
}

function renderRates(rates) {
  const box = document.getElementById("shipping-options");
  if (!box) return;

  if (!rates.length) {
    box.textContent = "No shipping options found.";
    chosenRate = null;
    updateTotalsWithRate();
    return;
  }

  box.innerHTML = `
    <div class="rate-list" style="display:grid;gap:.5rem;">
      ${rates
        .map((r, i) => {
          const est = r.estimated_days ? ` (~${r.estimated_days} days)` : "";
          return `
            <label class="rate-row" style="display:flex;gap:.5rem;align-items:center;">
              <input type="radio" name="shipRate" value="${r.object_id}" ${i === 0 ? "checked" : ""}/>
              <span>${r.provider} — ${r.servicelevel_name || "Service"} — ${fmtMoney(r.amount)}${est}</span>
            </label>`;
        })
        .join("")}
    </div>
  `;

  // default to first
  chosenRate = rates[0] || null;
  updateTotalsWithRate();

  box.querySelectorAll('input[name="shipRate"]').forEach((input) => {
    input.addEventListener("change", () => {
      const id = box.querySelector('input[name="shipRate"]:checked')?.value;
      chosenRate = rates.find((r) => r.object_id === id) || null;
      updateTotalsWithRate();
    });
  });
}

function readToAddressFromForm() {
  const fullName = document.getElementById("fullName")?.value?.trim() || "Customer";
  const email = document.getElementById("email")?.value?.trim() || "";
  const phone = document.getElementById("phone")?.value?.trim() || "";

  const address1 = document.getElementById("address1")?.value?.trim() || "";
  const address2 = document.getElementById("address2")?.value?.trim() || "";
  const city = document.getElementById("city")?.value?.trim() || "";
  const state = document.getElementById("state")?.value?.trim() || "";
  const zip = document.getElementById("zip")?.value?.trim() || "";

  return {
    name: fullName,
    street1: address1,
    street2: address2 || undefined,
    city,
    state,
    zip,
    country: "China", 
    email,
    phone,
  };
}

async function onSubmit(e) {
  e.preventDefault();
  const form = e.currentTarget;
  hideMsg();

  try {
    if (!chosenRate) {
      throw new Error("Please fetch and select a shipping option before placing the order.");
    }

    const order = buildOrder(form, chosenRate);

    const btn = document.getElementById("place-order");
    btn.disabled = true;

    // Demo submit to local “server”
    const { id } = await fakeSubmitOrder(order);

    clearCart();
    updateCartBadge();
    sessionStorage.setItem("lastOrderId", id);
    window.location.href = `/checkout/confirmation.html?orderId=${encodeURIComponent(id)}`;
  } catch (err) {
    showError(err.messages?.join(" • ") || err.message || "Checkout failed");
  } finally {
    const btn = document.getElementById("place-order");
    if (btn) btn.disabled = false;
  }
}

// ----- Local “server” (demo) -----
async function fakeSubmitOrder(order) {
  await new Promise((r) => setTimeout(r, 500));
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  const id = order.id || `ord_${Date.now()}`;
  const saved = { ...order, id, status: "CONFIRMED" };
  orders.push(saved);
  localStorage.setItem("orders", JSON.stringify(orders));
  return { id };
}

// ---- UX helpers ----
function showError(msg) {
  const p = document.getElementById("checkout-error");
  if (p) {
    p.textContent = msg;
    p.style.display = "block";
  }
  const s = document.getElementById("checkout-success");
  if (s) s.style.display = "none";
}

function showSuccess(msg) {
  const p = document.getElementById("checkout-success");
  if (p) {
    p.textContent = msg;
    p.style.display = "block";
  }
  const e = document.getElementById("checkout-error");
  if (e) e.style.display = "none";
}

function hideMsg() {
  const e = document.getElementById("checkout-error");
  const s = document.getElementById("checkout-success");
  if (e) e.style.display = "none";
  if (s) s.style.display = "none";
}
