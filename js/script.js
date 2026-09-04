document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  const modalTriggers = document.querySelectorAll('.product-modal-trigger');
  const modals = document.querySelectorAll('.product-modal');
  let activeModal = null;

  const closeModal = (modal) => {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    activeModal = null;
  };

  modalTriggers.forEach((modalTrigger) => {
    modalTrigger.addEventListener('click', (event) => {
      event.preventDefault();
      const modal = document.querySelector(modalTrigger.getAttribute('href'));
      const modalClose = modal?.querySelector('.product-modal-close');
      if (!modal || !modalClose) return;
      modal.hidden = false;
      activeModal = modal;
      document.body.classList.add('modal-open');
      modalClose.focus();
    });
  });
  modals.forEach((modal) => {
    modal.querySelector('.product-modal-close')?.addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal(modal);
    });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && activeModal) closeModal(activeModal);
  });

  const form = document.querySelector('#contact-form');
  if (!form) return;

  const product = document.querySelector('#product');
  const basureraOptions = document.querySelector('#basurera-options');
  const rolloOptions = document.querySelector('#rollo-options');
  const basureraPresentation = document.querySelector('#basurera-presentation');
  const rolloPresentation = document.querySelector('#rollo-presentation');
  const status = document.querySelector('#form-status');

  // Each product owns its optional fields, making it easy to add future variants.
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
    const lines = [
      'Hola, Plásticos Bogotá. Quiero solicitar información.',
      `Nombre: ${data.get('name')}`,
      `Producto: ${data.get('product')}`,
    ];
    if (data.get('basureraPresentation')) lines.push(`Presentación: ${data.get('basureraPresentation')}`);
    if (data.get('rolloPresentation')) lines.push(`Presentación: ${data.get('rolloPresentation')}`);
    if (data.get('rolloMeasure')) lines.push(`Medida deseada: ${data.get('rolloMeasure')}`);
    if (data.get('quantity')) lines.push(`Cantidad: ${data.get('quantity')}`);
    if (data.get('city')) lines.push(`Ciudad: ${data.get('city')}`);
    if (data.get('comments')) lines.push(`Comentarios: ${data.get('comments')}`);

    // TODO: reemplazar con el WhatsApp oficial cuando sea confirmado.
    const whatsappNumber = '573122184430';
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
  });
});
