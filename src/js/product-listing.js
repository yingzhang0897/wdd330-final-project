import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

document.addEventListener("DOMContentLoaded", () => {
  const productListContainer = document.getElementById("product-list");

  const category = getParam("category");


  if (!category) {
    productListContainer.innerHTML = "<p>No category selected.</p>";
    return;
  }

  const apiUrl = `https://wdd330-furniturestoreapi.onrender.com/api/products/category/${category}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    })
    .then((products) => {
      if (products.length === 0) {
        productListContainer.innerHTML = "<p>No products found in this category.</p>";
        return;
      }

      productListContainer.innerHTML = products
        .map((product) => {
          const encodedName = encodeURIComponent(product.name);
          const encodedCategory = encodeURIComponent(category);

          return `
            <a href="../product-pages/product-detail.html?category=${encodedCategory}&name=${encodedName}" class="product-link">
              <div class="product-card">
                <img src="${product.imageUrl}" alt="${product.name}" />
                <h3>${product.Brand}</h3>
                <p>${product.name}</p>
                <p>$${product.ListPrice}</p>
                <p>$${product.FinalPrice}</p>
              </div>
            </a>
          `;
        })
        .join("");
    })
    .catch((error) => {
      console.error("Error loading products:", error);
      productListContainer.innerHTML = "<p>Error loading products.</p>";
    });
});
