/* =======================
   HEADER: hide on scroll
   ======================= */
(() => {
  const header = document.querySelector(".site-header");
  const nav = document.getElementById("nav");
  if (!header) return;

  let lastY = window.scrollY;
  let upAcc = 0; // subida acumulada
  let downAcc = 0; // bajada acumulada
  const SHOW_AFTER_UP = 80; // píxeles de subida para volver a mostrar
  const HIDE_AFTER_DOWN = 10; // umbral para ocultar

  function onScroll() {
    const y = window.scrollY;
    const dy = y - lastY;

    // menú móvil abierto => no ocultamos el header
    const navOpen = nav && nav.classList.contains("open");

    if (dy > 0) {
      // bajando
      downAcc += dy;
      upAcc = 0;
      if (!navOpen && downAcc > HIDE_AFTER_DOWN && y > header.offsetHeight) {
        header.classList.add("is-hidden");
      }
    } else if (dy < 0) {
      // subiendo
      upAcc += -dy;
      downAcc = 0;
      if (upAcc > SHOW_AFTER_UP || y <= 0) {
        header.classList.remove("is-hidden");
      }
    }
    lastY = y;
  }

  // Por si el cursor toca el borde superior, revelamos (útil en desktop)
  header.addEventListener("mouseenter", () =>
    header.classList.remove("is-hidden")
  );

  window.addEventListener("scroll", onScroll, { passive: true });
})();

/* =======================
   NAV móvil (toggle)
   ======================= */
/* =======================
   NAV móvil (toggle)
   ======================= */
(() => {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#nav");
  if (!navToggle || !nav) return;

  const setIcon = (open) => {
    navToggle.innerHTML = open ? "✕" : "☰";
    navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  };

  // 👉 función única para abrir/cerrar (incluye overlay y lock scroll)
  const setOpen = (open) => {
    nav.classList.toggle("open", open);
    setIcon(open);
    document.body.style.overflow = open ? "hidden" : "";
    document.body.classList.toggle("menu-open", open); // <— opacidad del fondo
  };

  // Estado inicial del icono
  setIcon(nav.classList.contains("open"));

  // Toggle al click
  navToggle.addEventListener("click", () => {
    setOpen(!nav.classList.contains("open"));
  });

  // Cerrar con ESC
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      setOpen(false);
    }
  });

  // Cerrar al hacer click en un enlace del menú
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  // Cerrar al clickear la "X" dibujada en la esquina (tu lógica existente)
  nav.addEventListener("click", (e) => {
    const rect = nav.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const buttonSize = 30;
    const buttonX = rect.width - 20 - buttonSize;
    const buttonY = 20;
    if (
      clickX >= buttonX &&
      clickX <= buttonX + buttonSize &&
      clickY >= buttonY &&
      clickY <= buttonY + buttonSize
    ) {
      setOpen(false);
    }
  });
})();

/* =======================
   Formularios (home)
   ======================= */
(() => {
  const f = document.getElementById("contact-form");
  const msg = document.getElementById("form-message");
  if (!f || !msg) return;

  f.addEventListener("submit", (e) => {
    e.preventDefault();
    msg.textContent =
      "¡Gracias! Recibimos tu consulta. Te contactaremos dentro de las próximas 24 horas.";
    msg.style.display = "block";
    msg.style.color = "#22c55e";
    f.reset();
  });
})();

/* =======================
   Formulario (página Contacto) - EmailJS
   ======================= */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formContacto");
  const btn = document.getElementById("button");
  
  if (!form || !btn) return;

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    // Cambiar estado del botón
    btn.value = 'Enviando...';
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    // Configuración de EmailJS
    const serviceID = 'default_service';
    const templateID = 'template_f1dp3y9';

    // Enviar email
    emailjs.sendForm(serviceID, templateID, this)
      .then(() => {
        // Éxito
        btn.value = 'Enviar';
        btn.textContent = 'Enviar';
        btn.disabled = false;
        
        // Mostrar mensaje de éxito
        showMessage('¡Gracias! Recibimos tu consulta. Te contactaremos prontamente.', 'success');
        form.reset();
      }, (err) => {
        // Error
        btn.value = 'Enviar';
        btn.textContent = 'Enviar';
        btn.disabled = false;
        
        console.error('Error al enviar email:', err);
        showMessage('Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.', 'error');
      });
  });

  // Función para mostrar mensajes
  function showMessage(text, type) {
    // Crear elemento de mensaje si no existe
    let messageEl = document.getElementById('mensajeConfirmacion');
    if (!messageEl) {
      messageEl = document.createElement('div');
      messageEl.id = 'mensajeConfirmacion';
      messageEl.style.cssText = `
        margin-top: 1.5rem;
        text-align: center;
        font-size: 1.125rem;
        font-family: "Roboto", sans-serif;
        font-weight: bold;
        padding: 1rem;
        border-radius: 5px;
        display: none;
      `;
      form.appendChild(messageEl);
    }

    messageEl.textContent = text;
    messageEl.style.display = 'block';
    messageEl.style.color = type === 'success' ? '#22c55e' : '#ef4444';
    messageEl.style.backgroundColor = type === 'success' ? '#f0fdf4' : '#fef2f2';
    messageEl.style.border = `1px solid ${type === 'success' ? '#22c55e' : '#ef4444'}`;

    // Scroll hacia el mensaje
    messageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});
