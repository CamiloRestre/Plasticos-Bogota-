document.addEventListener('DOMContentLoaded', () => {
  /* =========================================================
     MENÚ MÓVIL
     ========================================================= */
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  /* =========================================================
     MODALES DE PRODUCTO
     Cada modal es independiente (hermano de los demás en el
     DOM, ver index.html). Este script no asume anidamiento ni
     depende de anchors con href="#id" para evitar que el clic
     modifique el historial/URL del navegador; usa botones con
     data-modal-target en su lugar.
     ========================================================= */
  const modalTriggers = document.querySelectorAll('.product-modal-trigger');
  const modals = document.querySelectorAll('.product-modal');

  let activeModal = null;
  let lastFocusedElement = null;

  const getFocusableElements = (modal) =>
    Array.from(
      modal.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => el.offsetParent !== null);

  const trapFocus = (event) => {
    if (!activeModal || event.key !== 'Tab') return;
    const focusable = getFocusableElements(activeModal);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const openModal = (modal) => {
    if (!modal) return;
    lastFocusedElement = document.activeElement;
    modal.hidden = false;
    activeModal = modal;
    document.body.classList.add('modal-open');

    const closeBtn = modal.querySelector('.product-modal-close');
    (closeBtn || modal).focus();
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    activeModal = null;

    // Devuelve el foco a quien abrió el modal (accesibilidad + evita
    // que el usuario "pierda" su posición en la página).
    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
    lastFocusedElement = null;
  };

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const targetId = trigger.getAttribute('data-modal-target');
      const modal = targetId ? document.getElementById(targetId) : null;
      if (modal) openModal(modal);
    });
  });

  modals.forEach((modal) => {
    modal.querySelector('.product-modal-close')?.addEventListener('click', () => closeModal(modal));

    // Cerrar al hacer clic en el fondo (backdrop), no en el contenido.
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal(modal);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (!activeModal) return;
    if (event.key === 'Escape') {
      closeModal(activeModal);
      return;
    }
    trapFocus(event);
  });

  /* =========================================================
     FORMULARIO DE CONTACTO (contacto.html)
     ========================================================= */
  const form = document.querySelector('#contact-form');
  if (!form) return;

  const product = document.querySelector('#product');
  const basureraOptions = document.querySelector('#basurera-options');
  const rolloOptions = document.querySelector('#rollo-options');
  const basureraPresentation = document.querySelector('#basurera-presentation');
  const rolloPresentation = document.querySelector('#rollo-presentation');
  const status = document.querySelector('#form-status');

  // Lista blanca de productos válidos. Cualquier valor que no esté
  // aquí se ignora al construir el mensaje, evitando que datos
  // manipulados (p.ej. vía devtools) terminen en el mensaje de WhatsApp.
  const VALID_PRODUCTS = new Set([
    'Bolsa basurera', 'Rollo precorte', 'Bolsa precorte',
    'Bolsa precorte en alta', 'Bolsa precorte en bio',
    'Bolsa manigueta', 'Bolsa hermética',
  ]);
  const VALID_BASURERA_PRESENTATIONS = new Set([
    '90×110 - Calibre 1,7 - Industrial - Rojo',
    '65×90 - Calibre 1,3 - Naranja',
    '65×90 - Calibre 0,8 - Caliente - Verde',
    '50×80 - Calibre 0,8 - Azul',
  ]);
  const VALID_ROLLO_PRESENTATIONS = new Set(['Bio', 'Alta']);

  // Recorta longitud y elimina caracteres de control para que texto
  // libre (nombre, cantidad, ciudad, comentarios) no pueda inflar o
  // romper el mensaje final de WhatsApp.
  const sanitizeFreeText = (value, maxLength) =>
    (value || '')
      .replace(/[\u0000-\u001F\u007F]/g, '')
      .trim()
      .slice(0, maxLength);

  product.addEventListener('change', () => {
    const isBasurera = product.value === 'Bolsa basurera';
    const isRollo = product.value === 'Rollo precorte';
    basureraOptions.hidden = !isBasurera;
    rolloOptions.hidden = !isRollo;
    basureraPresentation.required = isBasurera;
    rolloPresentation.required = isRollo;
    status.textContent = '';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);

    const name = sanitizeFreeText(data.get('name'), 80);
    const productValue = VALID_PRODUCTS.has(data.get('product')) ? data.get('product') : '';
    const quantity = sanitizeFreeText(data.get('quantity'), 60);
    const city = sanitizeFreeText(data.get('city'), 60);
    const comments = sanitizeFreeText(data.get('comments'), 400);
    const rolloMeasure = sanitizeFreeText(data.get('rolloMeasure'), 60);

    if (!name || !productValue) {
      status.textContent = 'Revisa el nombre y el producto seleccionado.';
      return;
    }

    const lines = [
      'Hola, Plásticos Bogotá. Quiero solicitar información.',
      `Nombre: ${name}`,
      `Producto: ${productValue}`,
    ];

    const basureraValue = data.get('basureraPresentation');
    if (basureraValue && VALID_BASURERA_PRESENTATIONS.has(basureraValue)) {
      lines.push(`Presentación: ${basureraValue}`);
    }

    const rolloValue = data.get('rolloPresentation');
    if (rolloValue && VALID_ROLLO_PRESENTATIONS.has(rolloValue)) {
      lines.push(`Presentación: ${rolloValue}`);
    }

    if (rolloMeasure) lines.push(`Medida deseada: ${rolloMeasure}`);
    if (quantity) lines.push(`Cantidad: ${quantity}`);
    if (city) lines.push(`Ciudad: ${city}`);
    if (comments) lines.push(`Comentarios: ${comments}`);

    // TODO: reemplazar con el WhatsApp oficial cuando sea confirmado.
    const whatsappNumber = '573122184430';
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
});
