import { getCart, setCart } from "./CartManager.mjs";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("cart-container");
  let cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  renderCartItems();

  function renderCartItems() {
    container.innerHTML = "";

    let subtotal = 0;

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const itemDiv = document.createElement("div");
      itemDiv.classList.add("cart-item");
      itemDiv.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}" />
        <div class="item-info">
          <h3>${item.name}</h3>
          <p>Price: $${item.price.toFixed(2)}</p>
          <label>
            Quantity: 
            <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="qty-input" />
          </label>
          <p>Total: $${itemTotal.toFixed(2)}</p>
          <button class="remove-btn" data-index="${index}">Remove</button>
        </div>
      `;

      container.appendChild(itemDiv);
    });

    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    const summary = document.createElement("div");
    summary.classList.add("cart-summary");
    summary.innerHTML = `
      <p>Subtotal: $${subtotal.toFixed(2)}</p>
      <p>Tax (10%): $${tax.toFixed(2)}</p>
      <h3>Total: $${total.toFixed(2)}</h3>
    `;

    container.appendChild(summary);

    // Add event listeners to quantity inputs
    document.querySelectorAll(".qty-input").forEach(input => {
      input.addEventListener("change", e => {
        const idx = e.target.dataset.index;
        const qty = parseInt(e.target.value);
        if (qty > 0) {
          cart[idx].quantity = qty;
          setCart(cart);
          renderCartItems(); // Re-render
        }
      });
    });

    // Add event listeners to remove buttons
    document.querySelectorAll(".remove-btn").forEach(button => {
      button.addEventListener("click", e => {
        const idx = e.target.dataset.index;
        cart.splice(idx, 1);
        setCart(cart);
        renderCartItems(); // Re-render
      });
    });
  }

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
    } else {
      window.location.href = "checkout.html";
    }
  });
});
