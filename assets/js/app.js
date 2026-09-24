/**
 * La Martina - Aplicación Web Principal
 * Interactividad, navegación suave, alertas toast y utilidades
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-nav');

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.classList.toggle('fa-bars');
          icon.classList.toggle('fa-xmark');
        }
      });

      // Cerrar menú al hacer clic en enlaces
      const navLinks = mobileMenu.querySelectorAll('a');
      navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          mobileMenu.classList.remove('active');
          const icon = mobileMenuBtn.querySelector('i');
          if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-xmark');
          }
        });
      });
    }

    // 2. Smooth Scrolling para enlaces ancla
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });

    // 3. Sistema Toast de Notificaciones
    window.showToast = function (message, type = 'success') {
      const container = document.getElementById('toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-info'}"></i>
        <span>${message}</span>
      `;
      container.appendChild(toast);

      setTimeout(() => {
        toast.classList.add('show');
      }, 50);

      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 400);
      }, 4000);
    };

    // 4. Copiar enlace al portapapeles
    const copyLinkBtns = document.querySelectorAll('.btn-copy-link');
    copyLinkBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const urlToCopy = btn.getAttribute('data-url') || window.location.href;
        navigator.clipboard.writeText(urlToCopy).then(() => {
          window.showToast('¡Enlace copiado al portapapeles!', 'success');
        });
      });
    });

    // 5. Botones de descarga de material con feedback visual
    const downloadBtns = document.querySelectorAll('.btn-track-download');
    downloadBtns.forEach((btn) => {
      btn.addEventListener('click', function () {
        const docName = this.getAttribute('data-doc') || 'Documento';
        window.showToast(`Descargando ${docName}...`, 'success');
      });
    });
  });
})();
