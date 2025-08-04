import ExternalServices from "./ExternalServices.mjs";
import { getParam } from "./utils.mjs";
import { addToCart } from "./CartManager.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  const productId = getParam("id");
  const container = document.getElementById("product-detail");

  if (!productId) {
    container.innerHTML = "<p>Invalid product ID.</p>";
    return;
  }

  const service = new ExternalServices("/api/products");
  const product = await service.getProductById(productId);

  if (!product) {
    container.innerHTML = "<p>Product not found.</p>";
    return;
  }

  const template = `
    <div class="product-detail-container">
      <img src="${product.imageUrl}" alt="${product.name}" />
      <div class="product-info">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p><strong>Price:</strong> $${product.price}</p>
        <p><strong>In Stock:</strong> ${product.stockQuantity}</p>
        <button id="addToCartBtn">Add to Cart</button>
      </div>
    </div>
  `;
  container.innerHTML = template;

  document.getElementById("addToCartBtn").addEventListener("click", () => {
    addToCart(product);
    alert("Item added to cart!");
  });
});
