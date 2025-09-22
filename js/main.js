// Menú responsive
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#nav");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

// Formulario contacto
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    formMessage.textContent =
      "¡Gracias! Recibimos tu consulta. Te contactaremos dentro de las próximas 24 horas.";
    formMessage.style.display = "block";
    formMessage.style.color = "#22c55e";

    contactForm.reset();
  });
}

// Confirmación formulario contacto-pagina de contacto
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formContacto");
  const mensaje = document.getElementById("mensajeConfirmacion");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      mensaje.textContent =
        "¡Gracias! Recibimos tu consulta. Te contactaremos dentro de las próximas 24 horas.";
      mensaje.style.display = "block";
      form.reset();
    });
  }
});
