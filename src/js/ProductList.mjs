import ExternalServices from "./ExternalServices.mjs";
import { getParam } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  const category = getParam("category");
  const container = document.querySelector("#product-list");
  const service = new ExternalServices("/api/products");

  const data = await service.getData();
  const filtered = category ? data.filter(p => p.category === category) : data;

  filtered.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <a href="product-detail.html?id=${product.id}">
        <img src="${product.imageUrl}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
      </a>
    `;
    container.appendChild(card);
  });
});
