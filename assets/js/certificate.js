/**
 * La Martina - Generador de Certificados Culinarios (JS Engine)
 * Renderizado en tiempo real sobre Canvas 2D + Exportación a JPG HD y PDF
 * 100% Estático para GitHub Pages y almacenamiento en LocalStorage
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'lamartina_9no_certificado';
  const TEMPLATE_SRC = 'assets/img/certificado-plantilla.jpg';
  const FONT_NAME = 'Madina';

  // Canvas dimensiones originales en alta definición (11 x 8.5 in @ 300 DPI)
  const CANVAS_WIDTH = 3300;
  const CANVAS_HEIGHT = 2550;
  const TEXT_CENTER_X = 1650;
  const TEXT_CENTER_Y = 1285; // Posición óptima calculada en la plantilla
  const MAX_TEXT_WIDTH = 2650;
  const INITIAL_FONT_SIZE = 250;

  let templateImage = null;
  let currentCertData = null;
  let prospectiveFolio = null;

  // Elementos DOM
  const formSection = document.getElementById('cert-form-container');
  const resultSection = document.getElementById('cert-result-container');
  const nameInput = document.getElementById('student-name-input');
  const generateBtn = document.getElementById('btn-generate-cert');
  const nameError = document.getElementById('name-input-error');
  const prospectiveFolioEl = document.getElementById('prospective-folio');
  const previewCanvas = document.getElementById('cert-canvas-preview');
  const certFolioDisplay = document.getElementById('cert-folio-display');
  const certNameDisplay = document.getElementById('cert-name-display');
  const certDateDisplay = document.getElementById('cert-date-display');
  const btnDownloadJpg = document.getElementById('btn-download-jpg');
  const btnDownloadPdf = document.getElementById('btn-download-pdf');
  const btnEditCert = document.getElementById('btn-edit-cert');
  const btnModalView = document.getElementById('btn-modal-view');
  const certModal = document.getElementById('cert-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalImage = document.getElementById('modal-cert-image');

  // Inicialización
  async function init() {
    await preloadResources();
    checkStoredCertificate();
    bindEvents();
  }

  // Pre-carga de imagen base y fuentes
  async function preloadResources() {
    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch (e) {
        console.warn('Document fonts warning:', e);
      }
    }

    const domImg = document.getElementById('template-cert-img');
    if (domImg) {
      if (domImg.complete && domImg.naturalWidth > 0) {
        templateImage = domImg;
        return;
      }
      await new Promise((resolve) => {
        domImg.addEventListener('load', () => {
          templateImage = domImg;
          resolve();
        }, { once: true });
        domImg.addEventListener('error', () => {
          console.warn('Fallback al crear objeto Image()');
          resolve();
        }, { once: true });
      });
    }

    if (!templateImage || !templateImage.complete) {
      templateImage = new Image();
      templateImage.src = TEMPLATE_SRC;
      await new Promise((resolve) => {
        templateImage.onload = () => resolve();
        templateImage.onerror = () => {
          console.error('Error cargando plantilla de certificado:', TEMPLATE_SRC);
          resolve();
        };
      });
    }
  }

  // Formato tipo Título (Capitalizar nombres)
  function formatTitleCase(str) {
    if (!str) return '';
    const particles = ['de', 'del', 'la', 'las', 'los', 'y', 'e', 'san', 'da', 'dos'];
    return str
      .trim()
      .split(/\s+/)
      .map((word, idx) => {
        const lower = word.toLowerCase();
        if (idx !== 0 && particles.includes(lower)) {
          return lower;
        }
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      })
      .join(' ');
  }

  // Generar ID Folio único y profesional
  function generateFolioId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const randNum = Math.floor(1000 + Math.random() * 9000);
    return `LM-9NO-${randNum}-${code}`;
  }

  // Comprobar si ya existe un certificado en LocalStorage
  function checkStoredCertificate() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        currentCertData = JSON.parse(stored);
        displaySavedCertificate(currentCertData);
        return;
      }
    } catch (e) {
      console.warn('Aviso al leer LocalStorage:', e);
    }
    showForm();
  }

  // Mostrar el formulario en modo creación o edición
  function showForm(prefillName = '') {
    if (formSection) formSection.classList.remove('hidden');
    if (resultSection) resultSection.classList.add('hidden');

    // Asignar folio prospectivo si no existía
    if (!prospectiveFolio) {
      prospectiveFolio = currentCertData && currentCertData.folio ? currentCertData.folio : generateFolioId();
    }
    if (prospectiveFolioEl) {
      prospectiveFolioEl.textContent = prospectiveFolio;
    }

    if (nameInput) {
      nameInput.value = prefillName;
      nameInput.focus();
    }

    updateLivePreview();
  }

  // Actualizar la vista previa en vivo en el Canvas mientras el usuario escribe
  function updateLivePreview() {
    const rawVal = nameInput ? nameInput.value.trim() : '';
    const activeFolio = prospectiveFolio || 'LM-9NO-XXXX-XXXX';

    if (rawVal.length === 0) {
      // Mostrar marcador de posición en color suave
      renderCertificateToCanvas('Nombre del Participante', activeFolio, previewCanvas, true);
    } else {
      const formatted = formatTitleCase(rawVal);
      renderCertificateToCanvas(formatted, activeFolio, previewCanvas, false);
    }
  }

  // Mostrar la vista del certificado ya emitido y guardado
  function displaySavedCertificate(data) {
    if (!data) return;
    if (formSection) formSection.classList.add('hidden');
    if (resultSection) resultSection.classList.remove('hidden');

    if (certFolioDisplay) certFolioDisplay.textContent = data.folio;
    if (certNameDisplay) certNameDisplay.textContent = data.name;
    if (certDateDisplay) certDateDisplay.textContent = data.issueDate || '24 de Septiembre, 2026';

    renderCertificateToCanvas(data.name, data.folio, previewCanvas, false);
  }

  // Renderizar sobre el Canvas de 3300x2550
  function renderCertificateToCanvas(name, folio, targetCanvas, isPlaceholder = false) {
    if (!targetCanvas) return;
    if (!templateImage || !templateImage.complete || templateImage.naturalWidth === 0) {
      setTimeout(() => renderCertificateToCanvas(name, folio, targetCanvas, isPlaceholder), 120);
      return;
    }

    targetCanvas.width = CANVAS_WIDTH;
    targetCanvas.height = CANVAS_HEIGHT;
    const ctx = targetCanvas.getContext('2d');

    // 1. Dibujar plantilla base
    ctx.drawImage(templateImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 2. Calcular y dibujar Nombre del Participante
    let fontSize = INITIAL_FONT_SIZE;
    ctx.font = `${fontSize}px "${FONT_NAME}", "Brush Script MT", cursive`;

    let textWidth = ctx.measureText(name).width;
    while (textWidth > MAX_TEXT_WIDTH && fontSize > 80) {
      fontSize -= 4;
      ctx.font = `${fontSize}px "${FONT_NAME}", "Brush Script MT", cursive`;
      textWidth = ctx.measureText(name).width;
    }

    ctx.fillStyle = isPlaceholder ? 'rgba(80, 40, 65, 0.35)' : '#321427';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, TEXT_CENTER_X, TEXT_CENTER_Y);

    // 3. Dibujar Folio ID de autenticación
    ctx.font = 'bold 44px "Montserrat", "Outfit", "Segoe UI", sans-serif';
    ctx.fillStyle = isPlaceholder ? 'rgba(122, 100, 115, 0.4)' : '#7a6473';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(`FOLIO: ${folio}`, 3120, 2465);
  }

  // Disparar confeti de celebración
  function launchCelebration() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#BA131A', '#FFD700', '#F7A1B5', '#FFF']
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#BA131A', '#FFD700', '#F7A1B5']
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#BA131A', '#FFD700', '#F7A1B5']
        });
      }, 250);
    }
  }

  // Generar y Guardar Certificado
  function handleGenerate() {
    const rawVal = nameInput ? nameInput.value.trim() : '';
    if (rawVal.length < 3) {
      if (nameError) {
        nameError.textContent = 'Por favor ingresa tu nombre completo (mínimo 3 letras).';
        nameError.classList.remove('hidden');
      }
      nameInput.focus();
      return;
    }

    if (nameError) nameError.classList.add('hidden');

    const formattedName = formatTitleCase(rawVal);
    const folioId = prospectiveFolio || (currentCertData && currentCertData.folio ? currentCertData.folio : generateFolioId());
    const issueDate = '24 de Septiembre, 2026';

    currentCertData = {
      name: formattedName,
      folio: folioId,
      issueDate: issueDate,
      timestamp: Date.now()
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentCertData));
    } catch (e) {
      console.warn('No se pudo guardar en LocalStorage:', e);
    }

    displaySavedCertificate(currentCertData);
    launchCelebration();

    if (typeof window.showToast === 'function') {
      window.showToast('¡Certificado oficial generado y guardado!', 'success');
    }
  }

  // Descarga en formato JPG de alta definición
  function downloadJPG() {
    if (!previewCanvas || !currentCertData) return;

    try {
      previewCanvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          const filename = `Certificado_${currentCertData.name.replace(/\s+/g, '_')}_LaMartina.jpg`;
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        },
        'image/jpeg',
        0.96
      );
    } catch (err) {
      try {
        const dataUrl = previewCanvas.toDataURL('image/jpeg', 0.95);
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `Certificado_${currentCertData.name.replace(/\s+/g, '_')}_LaMartina.jpg`;
        a.click();
      } catch (err2) {
        alert('En GitHub Pages la descarga de imágenes y PDF funciona de forma nativa e inmediata.');
      }
    }
  }

  // Descarga en formato PDF estándar tamaño carta horizontal
  function downloadPDF() {
    if (!previewCanvas || !currentCertData) return;

    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
      alert('Cargando módulo PDF, por favor intenta en unos segundos...');
      return;
    }

    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: [792, 612]
      });

      const imgData = previewCanvas.toDataURL('image/jpeg', 0.95);
      doc.addImage(imgData, 'JPEG', 0, 0, 792, 612);

      const filename = `Certificado_${currentCertData.name.replace(/\s+/g, '_')}_LaMartina.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error('Error al exportar PDF:', err);
      alert('En GitHub Pages la descarga de PDF funciona de forma nativa e inmediata.');
    }
  }

  // Editar nombre del certificado conservando el mismo Folio
  function handleEdit() {
    showForm(currentCertData ? currentCertData.name : '');
  }

  // Abrir vista ampliada en modal
  function openModal() {
    if (!previewCanvas || !modalImage || !certModal) return;
    try {
      modalImage.src = previewCanvas.toDataURL('image/jpeg', 0.92);
      certModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    } catch (e) {
      console.warn('Modal view warning:', e);
    }
  }

  function closeModal() {
    if (!certModal) return;
    certModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Enlazar eventos
  function bindEvents() {
    if (generateBtn) {
      generateBtn.addEventListener('click', handleGenerate);
    }

    if (nameInput) {
      nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleGenerate();
        }
      });
      // Actualización en tiempo real conforme escribe
      nameInput.addEventListener('input', () => {
        if (nameError && !nameError.classList.contains('hidden')) {
          nameError.classList.add('hidden');
        }
        updateLivePreview();
      });
    }

    if (btnDownloadJpg) {
      btnDownloadJpg.addEventListener('click', downloadJPG);
    }

    if (btnDownloadPdf) {
      btnDownloadPdf.addEventListener('click', downloadPDF);
    }

    if (btnEditCert) {
      btnEditCert.addEventListener('click', handleEdit);
    }

    if (btnModalView) {
      btnModalView.addEventListener('click', openModal);
    }

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal);
    }

    if (certModal) {
      certModal.addEventListener('click', (e) => {
        if (e.target === certModal) closeModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && certModal && certModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
