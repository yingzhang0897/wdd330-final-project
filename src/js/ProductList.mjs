import { loadHeaderFooter } from "/js/utils.mjs";

loadHeaderFooter();

const params = new URLSearchParams(window.location.search);
const category = params.get("category");

document.getElementById("categoryTitle").textContent = category
  ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products`
  : "Products";

const endpoint = `https://wdd330-furniturestoreapi.onrender.com/api/products/category/${category}`;

async function fetchProducts() {
  try {
    const res = await fetch(endpoint);
    const products = await res.json();
    renderProducts(products);
  } catch (err) {
    document.getElementById("productGrid").textContent = "Failed to load products.";
    console.error(err);
  }
}

function renderProducts(products) {
  const container = document.getElementById("productGrid");
  container.innerHTML = products
    .map(
      (product) => `
      <div class="product-card">
        <img src="${product.imageUrl}" alt="${product.name}" />
        <h3>${product.Brand}</h3>
        <p>${product.name}</p>
        <p>$${product.ListPrice}</p>
        <p>$${product.FinalPrice}</p>
      </div>
    `
    )
    .join("");
}

fetchProducts();