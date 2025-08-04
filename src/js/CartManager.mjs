export function getCart() {
  const cart = localStorage.getItem("furniture-cart");
  return cart ? JSON.parse(cart) : [];
}

export function setCart(cart) {
  localStorage.setItem("furniture-cart", JSON.stringify(cart));
}

export function addToCart(product) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  setCart(cart);
}
