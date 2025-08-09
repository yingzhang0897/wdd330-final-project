import { getParam, loadHeaderFooter } from "/js/utils.mjs";
import { addItem, updateCartBadge } from "/js/cart-process.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter().catch((err) =>
    console.error("Header/Footer load failed", err)
  );

  const container = document.getElementById("product-detail");
  if (!container) return;

  const category = getParam("category");
  const productName = getParam("name");

  if (!category || !productName) {
    container.innerHTML = "<p>Missing product information.</p>";
    return;
  }

  container.innerHTML = `<p>Loading product…</p>`;

  try {
    const apiUrl = `https://wdd330-furniturestoreapi.onrender.com/api/products/category/${encodeURIComponent(
      category
    )}/product?name=${encodeURIComponent(productName)}`;

    const res = await fetch(apiUrl, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const product = await res.json();

    if (!product || product.error) {
      container.innerHTML = "<p>Product not found.</p>";
      return;
    }

    renderProduct(container, product);
  } catch (err) {
    console.error("Error loading product detail:", err);
    container.innerHTML = "<p>Error loading product details.</p>";
  }
});

function renderProduct(container, product) {
  const list = Number(product.ListPrice ?? product.price ?? 0);
  const final = Number(product.FinalPrice ?? product.price ?? 0);
  const hasDeal = list && final && final < list;
  const off = hasDeal ? list - final : 0;
  const pct = hasDeal ? Math.round((off / list) * 100) : 0;

  container.innerHTML = `
    <div class="product-detail-card">
      ${hasDeal ? `<span class="badge badge-sale">${pct}% OFF</span>` : ""}
      <img src="${product.imageUrl}" alt="${escapeHtml(product.name)}" />
      <div class="product-info">
        <h2>${escapeHtml(product.name)}</h2>
        <h3>Brand: ${escapeHtml(product.Brand ?? "-")}</h3>

        <div class="prices">
          ${hasDeal ? `<span class="list strike">$${list}</span>` : ""}
          <span class="final">$${final}</span>
          ${hasDeal ? `<span class="you-save">You save $${off}</span>` : ""}
        </div>

        <p>${escapeHtml(product.description || "No description available.")}</p>
        <button id="addToCart" type="button">Add to Cart</button>
      </div>
    </div>
  `;

  const btn = container.querySelector("#addToCart");
  btn?.addEventListener("click", async () => {
    try {
      btn.disabled = true;
      addItem({
        name: product.name,
        Brand: product.Brand,
        price: final,             // use the computed final price
        imageUrl: product.imageUrl,
      });
      updateCartBadge();          // update header badge immediately
      alert(`Added "${product.name}" to cart!`);
    } finally {
      btn.disabled = false;
    }
  });
}

// tiny helper to avoid injecting raw text into HTML
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
