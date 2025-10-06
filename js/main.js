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
  function initMobileNav() {
    const navToggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("nav");
    
    if (!navToggle || !nav) {
      console.warn("Elementos del menú móvil no encontrados");
      return;
    }

    function setIcon(open) {
      navToggle.innerHTML = open ? "✕" : "☰";
      navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    let scrollPosition = 0;

    function setOpen(open) {
      nav.classList.toggle("open", open);
      setIcon(open);
      
      if (open) {
        // Guardar la posición actual del scroll
        scrollPosition = window.pageYOffset;
        document.body.style.top = `-${scrollPosition}px`;
        document.body.classList.add("menu-open");
      } else {
        // Restaurar la posición del scroll
        document.body.classList.remove("menu-open");
        document.body.style.top = "";
        window.scrollTo(0, scrollPosition);
      }
    }

    // Configuración inicial
    setIcon(nav.classList.contains("open"));

    // Asegura que el botón esté por encima de overlays
    navToggle.style.position = "relative";
    navToggle.style.zIndex = "1002";

    // Control para evitar doble disparo en móviles
    let suppressNextClick = false;

    // Event Listeners
    navToggle.addEventListener("click", (e) => {
      if (suppressNextClick) {
        suppressNextClick = false;
        return;
      }
      e.preventDefault();
      setOpen(!nav.classList.contains("open"));
    });

    navToggle.addEventListener("touchstart", (e) => {
      e.preventDefault();
      suppressNextClick = true;
      setTimeout(() => (suppressNextClick = false), 350);
      setOpen(!nav.classList.contains("open"));
    });

    // Cerrar con Escape
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        setOpen(false);
      }
    });

    // Cerrar al hacer click en los enlaces
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => setOpen(false));
    });

    // Cerrar al hacer click fuera del menú o en el botón X
    document.addEventListener("click", (e) => {
      const closeButton = nav.querySelector(".site-nav.open::after");
      if ((nav.classList.contains("open") && 
          !nav.contains(e.target) && 
          !navToggle.contains(e.target)) ||
          (e.target === closeButton)) {
        setOpen(false);
      }
    });

    // Agregar evento click al botón X
    nav.addEventListener("click", (e) => {
      // Verificar si el click fue en el botón X (pseudo-elemento ::after)
      const rect = nav.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Área aproximada del botón X (40x40 pixels desde la esquina superior derecha)
      if (x >= rect.width - 40 && x <= rect.width && y >= 20 && y <= 60) {
        setOpen(false);
      }
    });
  }

  // Inicializar el menú móvil cuando el DOM está listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMobileNav);
  } else {
    initMobileNav();
  }
})();

/* =======================
   Formularios (home) - EmailJS
   ======================= */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const msg = document.getElementById("form-message");
  if (!form || !msg) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Cambiar estado del botón
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = "Enviando...";
    btn.disabled = true;

    // Configuración de EmailJS
    const serviceID = "default_service";
    const templateID = "template_f1dp3y9";

    // Enviar email
    emailjs.sendForm(serviceID, templateID, this).then(
      () => {
        // Éxito
        btn.textContent = originalText;
        btn.disabled = false;
        showMessageIndex(
          "¡Gracias! Recibimos tu consulta. Te contactaremos dentro de las próximas 24 horas.",
          "success"
        );
        form.reset();
      },
      (err) => {
        // Error
        btn.textContent = originalText;
        btn.disabled = false;
        console.error("Error al enviar email:", err);
        showMessageIndex(
          "Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.",
          "error"
        );
      }
    );
  });

  // Función para mostrar mensajes (versión para index)
  function showMessageIndex(text, type) {
    msg.textContent = text;
    msg.style.display = "block";
    msg.style.color = type === "success" ? "#0C3C60" : "#ef4444";
    msg.style.backgroundColor = type === "success" ? "#ffffff" : "#fef2f2";
    msg.style.border = `1px solid ${
      type === "success" ? "#ffffff" : "#ef4444"
    }`;
    msg.style.padding = "2rem 3rem";
    msg.style.borderRadius = "8px";
    msg.style.fontSize = "2rem";
    msg.style.fontFamily = '"Roboto", sans-serif';
    msg.style.lineHeight = "1.2";
    msg.style.fontWeight = "bold";
    msg.style.textAlign = "center";
    msg.style.marginTop = "1.5rem";
    msg.style.maxWidth = "600px";
    msg.style.marginLeft = "auto";
    msg.style.marginRight = "auto";

    // Scroll hacia el mensaje
    msg.scrollIntoView({ behavior: "smooth", block: "center" });

    // Ocultar el mensaje automáticamente después de 5 segundos
    setTimeout(() => {
      msg.style.display = "none";
    }, 5000);
  }
});

/* =======================
   Formulario (página Contacto) - EmailJS
   ======================= */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formContacto");
  const btn = document.getElementById("button");

  if (!form || !btn) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Cambiar estado del botón
    btn.value = "Enviando...";
    btn.textContent = "Enviando...";
    btn.disabled = true;

    // Configuración de EmailJS
    const serviceID = "default_service";
    const templateID = "template_f1dp3y9";

    // Enviar email
    emailjs.sendForm(serviceID, templateID, this).then(
      () => {
        // Éxito
        btn.value = "Enviar";
        btn.textContent = "Enviar";
        btn.disabled = false;

        // Mostrar mensaje de éxito
        showMessage(
          "¡Gracias! Recibimos tu consulta. Te contactaremos dentro de las próximas 24 horas.",
          "success"
        );
        form.reset();
      },
      (err) => {
        // Error
        btn.value = "Enviar";
        btn.textContent = "Enviar";
        btn.disabled = false;

        console.error("Error al enviar email:", err);
        showMessage(
          "Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.",
          "error"
        );
      }
    );
  });

  // Función para mostrar mensajes
  function showMessage(text, type) {
    // Crear elemento de mensaje si no existe
    let messageEl = document.getElementById("mensajeConfirmacion");
    if (!messageEl) {
      messageEl = document.createElement("div");
      messageEl.id = "mensajeConfirmacion";
      messageEl.style.cssText = `
            margin-top: 1.5rem;
            text-align: center;
            font-size: 2rem;
            font-family: "Roboto", sans-serif;
            line-height: 1.2;
            font-weight: bold;
            padding: 2rem 3rem;
            border-radius: 8px;
            display: none;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
          `;
      form.appendChild(messageEl);
    }

    messageEl.textContent = text;
    messageEl.style.display = "block";
    messageEl.style.color = type === "success" ? "#0C3C60" : "#ef4444";
    messageEl.style.backgroundColor =
      type === "success" ? "#ffffff" : "#fef2f2";
    messageEl.style.border = `1px solid ${
      type === "success" ? "#ffffff" : "#ef4444"
    }`;

    // Scroll hacia el mensaje
    messageEl.scrollIntoView({ behavior: "smooth", block: "center" });

    // Ocultar el mensaje automáticamente después de 5 segundos
    setTimeout(() => {
      messageEl.style.display = "none";
    }, 5000);
  }
});

/* =======================
   GA4 – Tracking unificado (CTAs + Formularios + Contacto)
   Requiere GA4 en <head> con id G-GT5RFZ0L4D
======================= */

// Fallbacks por si gtag aún no está
window.dataLayer = window.dataLayer || [];
window.gtag =
  window.gtag ||
  function () {
    dataLayer.push(arguments);
  };

/** 1) CLICS que llevan a la página de contacto
 *  - Detecta <a> cuyo href apunte a contacto.html / contacto / #contacto.
 *  - También botones con data-cta="contact" (para navegaciones via JS).
 *  - Además registra clics en mailto:/tel:/WhatsApp como 'contact_click'.
 */
document.addEventListener("click", function (e) {
  // a) <a ...> que llevan a contacto
  const link = e.target.closest("a");
  if (link) {
    const rawHref = (link.getAttribute("href") || "").trim();
    const href = rawHref || link.href || "";

    const isContactHref =
      /^#contacto\b/i.test(rawHref) || // ancla interna
      /contacto(\.html)?(\#.*|\?.*)?$/i.test(rawHref) || // relativo común
      (() => {
        // absoluto/relativo normalizado
        try {
          return new URL(href, location.href).pathname.includes("contacto");
        } catch {
          return false;
        }
      })();

    if (isContactHref) {
      gtag("event", "cta_contact_click", {
        link_url: href,
        link_text: (link.textContent || "").trim().slice(0, 120),
        from_page: location.pathname,
      });
      return; // evitar doble registro si además tiene data-cta
    }

    // b) Clics de contacto directo (tel/mail/whatsapp)
    if (
      /^mailto:/i.test(href) ||
      /^tel:/i.test(href) ||
      /(?:wa\.me|api\.whatsapp\.com)/i.test(href)
    ) {
      gtag("event", "contact_click", {
        method: /^mailto:/i.test(href)
          ? "email"
          : /^tel:/i.test(href)
          ? "phone"
          : "whatsapp",
        href: href,
        page: location.pathname,
      });
      return;
    }
  }

  // c) Botones sin <a> pero marcados con data-cta="contact"
  const ctaBtn = e.target.closest('[data-cta="contact"]');
  if (ctaBtn) {
    gtag("event", "cta_contact_click", {
      link_url: "(js-navigation)",
      link_text: (ctaBtn.textContent || "").trim().slice(0, 120),
      from_page: location.pathname,
    });
  }
});

/** 2) Formularios: contamos el lead SOLO cuando EmailJS confirma OK
 *  - Cubre #contact-form (home) y #formContacto (/contacto) u otros si los agregas.
 *  - Parchea emailjs.sendForm una vez disponible.
 */
(function patchEmailJSWithRetry() {
  const maxTries = 20; // ~5s si interval=250ms
  let tries = 0;
  const interval = setInterval(() => {
    tries++;
    if (
      window.emailjs &&
      typeof emailjs.sendForm === "function" &&
      !emailjs.__ga_patched
    ) {
      const original = emailjs.sendForm.bind(emailjs);
      emailjs.sendForm = function (...args) {
        const formEl = args[2];
        const formId = formEl && formEl.id ? formEl.id : "(unknown_form)";
        const p = original(...args);
        p.then(() => {
          gtag("event", "generate_lead", {
            form_id: formId,
            method: "emailjs",
            page_location: location.href,
          });
        });
        return p;
      };
      emailjs.__ga_patched = true;
      clearInterval(interval);
    }
    if (tries >= maxTries) clearInterval(interval);
  }, 250);
})();
