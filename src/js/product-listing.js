import { loadHeaderFooter,getParam } from "./utils.mjs";

const apiBase =
  "https://wdd330-furniturestoreapi.onrender.com/api/products/category/";

// Function to create product HTML
function renderProducts(products) {
  const container = document.querySelector("#product-list");
  if (!container) return;

  if (products.length === 0) {
    container.innerHTML = "<p>No products found in this category.</p>";
    return;
  }

  container.innerHTML = products
    .map(
      (product) => `
    <div class="product-card">
      <img src="${product.imageUrl}" alt="${product.name}" />
      <h3>${product.Brand}</h3>
      <p>${product.name || ""}</p>
      <p class="price">$${product.ListPrice}</p>
      <p class="price">$${product.FinalPrice}</p>
    </div>
  `,
    )
    .join("");
}

// Load and display products
async function loadProducts() {
  const category = getParam("category");

  if (!category) {
    alert("No category specified.");
    return;
  }

  try {
    const response = await fetch(`${apiBase}${category}`);
    const products = await response.json();
    renderProducts(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }
}
document.addEventListener("DOMContentLoaded", loadHeaderFooter);
document.addEventListener("DOMContentLoaded", loadProducts);
