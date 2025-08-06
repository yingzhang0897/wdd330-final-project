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
}
