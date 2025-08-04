const order = JSON.parse(localStorage.getItem("furniture-order"));

const container = document.getElementById("order-summary");

if (!order) {
  container.innerHTML = "<p>No order found.</p>";
} else {
  container.innerHTML = `
    <h2>Order Summary</h2>
    <p><strong>Name:</strong> ${order.name}</p>
    <p><strong>Shipping to ZIP:</strong> ${order.zip}</p>
    <p><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
    <p><strong>Shipping:</strong> $${order.shipping.toFixed(2)}</p>
    <h3>Total: $${order.total.toFixed(2)}</h3>
  `;

  // Optionally: list items
  const itemsList = document.createElement("ul");
  order.items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.quantity} × ${item.name}`;
    itemsList.appendChild(li);
  });

  container.appendChild(itemsList);

  // Cleanup
  localStorage.removeItem("furniture-cart");
  localStorage.removeItem("furniture-order");
}
