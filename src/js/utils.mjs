import { setupNewsletterForm } from "./newsletter.mjs";

export function getParam(param) {
  const url = new URL(window.location.href);
  return url.searchParams.get(param);
}

// utils.mjs
export async function loadHeaderFooter() {
  const header = await fetch("/partials/header.html").then(res => res.text());
  const footer = await fetch("/partials/footer.html").then(res => res.text());
  document.querySelector("header").innerHTML = header;
  document.querySelector("footer").innerHTML = footer;
  setupNewsletterForm();
  // Show cart count on page load
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const badge = document.querySelector(".cart-count");
  if (badge) {
    const count = cart.reduce((sum, i) => sum + (i.quantity || 0), 0);
    badge.textContent = String(count);
    badge.style.display = count ? "inline-block" : "none";
  }
}
