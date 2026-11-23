/* ==========================================================
   app.js — Portafolio Lucía Mora
   1) Menú móvil  2) Preselección de servicio
   3) Validación del formulario y mensaje de confirmación
   Sin librerías. No se envía nada a ningún servidor.
   ========================================================== */
(function () {
  'use strict';

  /* ---------- 1. Menú móvil ---------- */
  var toggle = document.getElementById('nav-toggle');
  var menu = document.getElementById('nav-menu');

  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Cierra el menú al elegir un enlace
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });

  // Cierra con Escape y devuelve el foco al botón
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });

  // Si se pasa a escritorio, deja el estado limpio
  window.matchMedia('(min-width: 768px)').addEventListener('change', function (mq) {
    if (mq.matches) setMenu(false);
  });

  /* ---------- 2. Botones de servicio preseleccionan el select ---------- */
  var servicio = document.getElementById('servicio');
  document.querySelectorAll('[data-servicio]').forEach(function (link) {
    link.addEventListener('click', function () {
      servicio.value = link.getAttribute('data-servicio');
    });
  });

  /* ---------- 3. Formulario ---------- */
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // Reglas por campo: devuelve el mensaje de error o '' si es válido
  var rules = {
    nombre: function (v) {
      if (!v) return 'Escribe tu nombre.';
      if (v.length < 2) return 'El nombre debe tener al menos 2 caracteres.';
      return '';
    },
    email: function (v) {
      if (!v) return 'Escribe tu correo electrónico.';
      if (!EMAIL_RE.test(v)) return 'Ingresa un correo válido, por ejemplo nombre@dominio.com.';
      return '';
    },
    mensaje: function (v) {
      if (!v) return 'Cuéntame brevemente qué necesitas.';
      if (v.length < 10) return 'El mensaje debe tener al menos 10 caracteres.';
      return '';
    }
  };

  function validateField(name) {
    var input = form.elements[name];
    var message = rules[name](input.value.trim());
    document.getElementById(name + '-error').textContent = message;
    input.classList.toggle('is-invalid', message !== '');
    input.setAttribute('aria-invalid', String(message !== ''));
    return message === '';
  }

  // Validación en vivo al salir del campo y al corregirlo
  Object.keys(rules).forEach(function (name) {
    var input = form.elements[name];
    input.addEventListener('blur', function () { validateField(name); });
    input.addEventListener('input', function () {
      if (input.classList.contains('is-invalid')) validateField(name);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // nunca se envía al servidor
    status.textContent = '';
    status.classList.remove('is-success');

    var firstInvalid = null;
    Object.keys(rules).forEach(function (name) {
      if (!validateField(name) && !firstInvalid) firstInvalid = form.elements[name];
    });

    if (firstInvalid) {
      firstInvalid.focus();
      status.textContent = 'Revisa los campos marcados antes de enviar.';
      return;
    }

    var nombre = form.elements.nombre.value.trim();
    status.textContent = 'Gracias, ' + nombre + '. Recibí tu mensaje y te responderé pronto.';
    status.classList.add('is-success');
    form.reset();
  });
})();
