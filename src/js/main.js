import ExternalServices from "./ExternalServices.mjs";
import { loadHeaderFooter } from "/js/utils.mjs";

loadHeaderFooter();

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("#featured-products");
  const service = new ExternalServices("/api/products");
  const data = await service.getData();

  data.slice(0, 4).forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <a href="product-detail.html?id=${product.id}">
        <img src="${product.imageUrl}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>$${product.FinalPrice}</p>
      </a>
    `;
    container.appendChild(card);
  });
});

