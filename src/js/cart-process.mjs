const STORAGE_KEY = "cart";

export const fmtMoney = (n) =>
  (typeof n === "number" ? n : Number(n || 0)).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

// ----- storage -----
export function readCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}
export function writeCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  updateCartBadge(items);
}

// ----- derived -----
export function getCount(items = readCart()) {
  return items.reduce((s, i) => s + (i.quantity || 0), 0);
}
export function subtotal(items = readCart()) {
  return items.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
}

// ----- mutations -----
export function addItem(p) {
  const items = readCart();
  const i = items.findIndex((x) => x.name === p.name);
  if (i > -1) items[i].quantity = (items[i].quantity || 1) + 1;
  else
    items.push({
      name: p.name,
      Brand: p.Brand,
      price: p.price ?? p.FinalPrice ?? 0,
      imageUrl: p.imageUrl,
      quantity: 1,
    });
  writeCart(items);
  return items;
}
export function setQty(index, qty) {
  const items = readCart();
  if (!items[index]) return items;
  items[index].quantity = Math.max(1, Math.floor(Number(qty) || 1));
  writeCart(items);
  return items;
}
export function changeQty(index, delta) {
  const items = readCart();
  if (!items[index]) return items;
  items[index].quantity = Math.max(1, (items[index].quantity || 1) + delta);
  writeCart(items);
  return items;
}
export function removeItem(index) {
  const items = readCart();
  items.splice(index, 1);
  writeCart(items);
  return items;
}
export function clearCart() {
  writeCart([]);
  return [];
}

// ----- badge -----
export function updateCartBadge(items = readCart()) {
  const badge = document.querySelector(".cart-count");
  if (!badge) return;
  const count = getCount(items);
  badge.textContent = String(count);
  badge.style.display = count ? "inline-block" : "none";
}
