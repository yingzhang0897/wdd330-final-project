console.log("product-details.js loaded");//debug

import { getParam, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter().catch(err => console.error("Header/Footer load failed", err));


document.addEventListener("DOMContentLoaded", () => {
  const productDetailContainer = document.getElementById("product-detail");

  const category = getParam("category");
  const productName = getParam("name");


  console.log("Category:", category);//debug
  console.log("Product Name:", productName);//debug


  if (!category || !productName) {
    productDetailContainer.innerHTML = "<p>Missing product information.</p>";
    return;
  }

  const apiUrl = `https://wdd330-furniturestoreapi.onrender.com/api/products/category/${category}/product?name=${encodeURIComponent(productName)}`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) throw new Error("Failed to fetch product data");
      return response.json();
    })
    .then(product => {
      if (!product || product.error) {
        productDetailContainer.innerHTML = "<p>Product not found.</p>";
        return;
      }

      productDetailContainer.innerHTML = `
        <div class="product-detail-card">
          <img src="${product.imageUrl}" alt="${product.name}" />
          <div class="product-info">
            <h2>${product.name}</h2>
            <h3>Brand: ${product.Brand}</h3>
            <p>Original Price: $${product.ListPrice}</p>
            <p>Sale Price: $${product.FinalPrice}</p>
            <p>${product.description || "No description available."}</p>
            <button id="addToCart">Add to Cart</button>
          </div>
        </div>
      `;

      document.getElementById("addToCart").addEventListener("click", () => {
        // Get cart or initialize
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Check if product already in cart
        const existingIndex = cart.findIndex(item => item.name === product.name);

        if (existingIndex > -1) {
          // Increment quantity
          cart[existingIndex].quantity += 1;
        } else {
          // Add new item
          cart.push({
            name: product.name,
            Brand: product.Brand,
            price: product.FinalPrice,
            imageUrl: product.imageUrl,
            quantity: 1
          });
        }

        // Save updated cart
        localStorage.setItem("cart", JSON.stringify(cart));

        alert(`Added "${product.name}" to cart!`);
      });
    })
    .catch(error => {
      console.error("Error loading product detail:", error);
      productDetailContainer.innerHTML = "<p>Error loading product details.</p>";
    });
});
