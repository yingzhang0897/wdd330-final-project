export function setupNewsletterForm(formId = "newsletterForm", messageId = "newsletterMessage") {
  const form = document.getElementById(formId);
  const message = document.getElementById(messageId);

  if (!form || !message) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = form.email.value.trim();

    // Basic email validation
    if (!validateEmail(email)) {
      message.textContent = "Please enter a valid email address.";
      message.style.color = "red";
      return;
    }

    // Simulate subscription (you can replace this with real API call)
    console.log("Subscribed:", email);
    message.textContent = "Thank you for subscribing!";
    message.style.color = "green";
    form.reset();
  });
}

function validateEmail(email) {
  // Simple regex for email validation
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}
