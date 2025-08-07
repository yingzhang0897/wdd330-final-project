import { getParam, loadHeaderFooter } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  loadHeaderFooter();

  const category = getParam("category");

  if (category) {
    const response = await fetch(
      `https://wdd330-furniturestoreapi.onrender.com/api/products/category/${category}`,
    );
    const products = await response.json();

    renderProductList(products);
  }
});

function renderProductList(products) {
  const container = document.getElementById("product-list");
  container.innerHTML = "";

  products.forEach((product) => {
    const item = document.createElement("div");
    item.classList.add("product");

    item.innerHTML = `
      <h3>${product.Brand}</h3>
      <img src="${product.imageUrl}" alt="${product.name}">
      <p>${product.name}</p>
      <p>$${product.ListPrice}</p>
      <p>$${product.FinalPrice}</p>
    `;

    container.appendChild(item);
  });
}
