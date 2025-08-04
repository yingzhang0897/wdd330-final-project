import { getCart } from "./CartManager.mjs";

const cart = getCart();
const form = document.getElementById("checkout-form");
const summary = document.getElementById("order-summary");

if (cart.length === 0) {
  summary.innerHTML = "<p>Your cart is empty.</p>";
  form.style.display = "none";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const name = formData.get("name");
  const address = formData.get("address");
  const toZip = formData.get("zip");

  // Calculate subtotal
  let subtotal = 0;
  let totalWeight = 0; // in ounces
  let dimensions = { length: 20, width: 20, height: 10 }; // default dims

  cart.forEach(item => {
    subtotal += item.price * item.quantity;
    totalWeight += 80 * item.quantity; // approx 80 oz (5 lbs) per item
  });

  // Optional: refine dimensions based on number of items
  dimensions.length = 20 + cart.length * 5;

  // Fetch shipping rate from your backend proxy (see below)
  const response = await fetch("/get-shipping-rate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      to_zip: toZip,
      weight: totalWeight,
      ...dimensions
    })
  });

  const data = await response.json();

  const shippingRate = data.rate;
  const total = subtotal + shippingRate;

  summary.innerHTML = `
    <h2>Order Summary</h2>
    <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
    <p><strong>Shipping:</strong> $${shippingRate.toFixed(2)}</p>
    <p><strong>Total:</strong> $${total.toFixed(2)}</p>
    <button onclick="alert('Order placed!')">Place Order</button>
  `;
});
