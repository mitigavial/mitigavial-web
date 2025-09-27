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
(() => {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#nav");
  if (!navToggle || !nav) return;

  // Función para actualizar el icono del botón
  const setIcon = (open) => {
    navToggle.innerHTML = open ? "✕" : "☰";
    navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  };

  // Inicializar el icono
  setIcon(nav.classList.contains("open"));

  // Toggle al hacer click
  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    setIcon(open);
    // Bloquear scroll del body cuando el menú está abierto
    document.body.style.overflow = open ? "hidden" : "";
  });

  // Cerrar con tecla ESC
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) {
      nav.classList.remove("open");
      setIcon(false);
      document.body.style.overflow = "";
    }
  });

  // Cerrar al hacer click en un enlace del menú
  const navLinks = nav.querySelectorAll("a");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      setIcon(false);
      document.body.style.overflow = "";
    });
  });

  // Cerrar al hacer click en el botón X (pseudo-elemento)
  nav.addEventListener("click", (e) => {
    // Verificar si el click fue en el área del botón X (esquina superior derecha)
    const rect = nav.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Área del botón X: esquina superior derecha (20px desde arriba y derecha)
    const buttonSize = 30;
    const buttonX = rect.width - 20 - buttonSize;
    const buttonY = 20;
    
    if (clickX >= buttonX && clickX <= buttonX + buttonSize && 
        clickY >= buttonY && clickY <= buttonY + buttonSize) {
      nav.classList.remove("open");
      setIcon(false);
      document.body.style.overflow = "";
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
   Formulario (página Contacto)
   ======================= */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formContacto");
  const mensaje = document.getElementById("mensajeConfirmacion");
  if (!form || !mensaje) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    mensaje.textContent =
      "¡Gracias! Recibimos tu consulta. Te contactaremos dentro de las próximas 24 horas.";
    mensaje.style.display = "block";
    form.reset();
  });
});

