import { readCart, subtotal } from "/js/cart-process.mjs";

export const fmtMoney = (n) =>
  (typeof n === "number" ? n : Number(n || 0)).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });

export function buildOrder(form, chosenRate = null) {
  const items = readCart();
  if (!items.length) throw new Error("Your cart is empty.");

  const errors = validateForm(form);
  if (errors.length) {
    const err = new Error("Invalid form");
    err.messages = errors;
    throw err;
  }

  const shipAmount = chosenRate ? Number(chosenRate.amount || 0) : 0;
  const sub = subtotal(items);
  const tax = 0; // keep as-is for now
  const grand = Number(sub) + shipAmount + tax;

  const order = {
    id: `ord_${Date.now()}`,
    createdAt: new Date().toISOString(),
    customer: {
      fullName: form.fullName.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
    },
    shipping: {
      address1: form.address1.value.trim(),
      address2: form.address2.value.trim(),
      city: form.city.value.trim(),
      state: form.state.value.trim(),
      zip: form.zip.value.trim(),
      // include the selected shipping rate for records
      rate: chosenRate
        ? {
            id: chosenRate.object_id,
            provider: chosenRate.provider,
            service: chosenRate.servicelevel_name || "Service",
            amount: Number(chosenRate.amount || 0),
            currency: chosenRate.currency || "USD",
          }
        : null,
    },
    items: items.map((i) => ({
      name: i.name,
      brand: i.Brand ?? null,
      price: Number(i.price || i.FinalPrice || 0),
      quantity: Number(i.quantity || 1),
      imageUrl: i.imageUrl,
    })),
    totals: {
      subtotal: sub,
      shipping: shipAmount,
      tax,
      grandTotal: grand,
    },
    payment: {
      brand: "demo",
      last4: form.cardNumber.value.replace(/\D/g, "").slice(-4),
      exp: form.exp.value,
    },
  };

  return order;
}

export function validateForm(form) {
  const messages = [];

  const required = ["fullName", "email", "address1", "city", "state", "zip", "cardNumber", "exp", "cvv"];
  required.forEach((name) => {
    if (!form[name].value.trim()) messages.push(`${name} is required`);
  });

  if (form.email.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.value))
    messages.push("Email is invalid");

  if (form.state.value && !/^[A-Za-z]{2}$/.test(form.state.value))
    messages.push("state must be 2 letters (e.g., AZ)");

  if (form.zip.value && !/^\d{5}(-\d{4})?$/.test(form.zip.value))
    messages.push("ZIP must be 5 digits (or 5-4)");

  const card = form.cardNumber.value.replace(/\D/g, "");
  if (card && card.length < 12) messages.push("Card number looks too short");

  if (form.exp.value && !/^\d{2}\/\d{2}$/.test(form.exp.value))
    messages.push("Expiration must be MM/YY");

  if (form.cvv.value && !/^\d{3,4}$/.test(form.cvv.value))
    messages.push("CVV must be 3–4 digits");

  return messages;
}
