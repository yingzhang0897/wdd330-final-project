import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

const fmt = (n) => Number(n || 0).toLocaleString(undefined, { style: "currency", currency: "USD" });
const discountInfo = (list, final) => {
  const L = Number(list), F = Number(final);
  if (!L || !F || F >= L) return { hasDeal: false, pct: 0, off: 0 };
  const off = L - F;
  const pct = Math.round((off / L) * 100);
  return { hasDeal: true, pct, off };
};

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

      productListContainer.innerHTML = products.map((product) => {
        const encodedName = encodeURIComponent(product.name);
        const encodedCategory = encodeURIComponent(category);
        const { hasDeal, pct } = discountInfo(product.ListPrice, product.FinalPrice);

        return `
          <a href="/product-pages/product-detail.html?category=${encodedCategory}&name=${encodedName}" class="product-link">
            <div class="product-card">
              ${hasDeal ? `<span class="badge badge-sale" aria-label="${pct}% off">${pct}% OFF</span>` : ""}
              <img src="${product.imageUrl}" alt="${product.name}" />
              <h3>${product.Brand ?? ""}</h3>
              <p class="name">${product.name}</p>
              <div class="prices">
                ${hasDeal ? `<span class="list strike">${fmt(product.ListPrice)}</span>` : ""}
                <span class="final">${fmt(product.FinalPrice)}</span>
              </div>
            </div>
          </a>
        `;
      }).join("");
    })
    .catch((error) => {
      console.error("Error loading products:", error);
      productListContainer.innerHTML = "<p>Error loading products.</p>";
    });
});
