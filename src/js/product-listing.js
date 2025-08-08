import { loadHeaderFooter,getParam } from "./utils.mjs";

loadHeaderFooter();
document.addEventListener("DOMContentLoaded", () => {
  const productListContainer = document.getElementById("product-list");

  // 1. Get category from URL
  const category = getParam("category");

  if (!category) {
    productListContainer.innerHTML = "<p>No category selected.</p>";
    return;
  }

  // 2. Fetch products from API
  const apiUrl = `https://wdd330-furniturestoreapi.onrender.com/api/products/category/${category}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    })
    .then((products) => {
      // 3. Display products
      if (products.length === 0) {
        productListContainer.innerHTML = "<p>No products found in this category.</p>";
        return;
      }

      productListContainer.innerHTML = products
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
    })
    .catch((error) => {
      console.error("Error loading products:", error);
      productListContainer.innerHTML = "<p>Error loading products.</p>";
    });
});
