# 🎂 La Martina | 9º Aniversario - Taller Virtual: "Postres Económicos y Ricos"

<p align="center">
  <img src="assets/img/logo.png" alt="Logo La Martina" width="120">
</p>

<p align="center">
  <strong>Sitio web oficial del evento de aniversario, centro de descarga de material didáctico y generador interactivo de certificados culinarios para GitHub Pages.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Estado-Activo-success?style=for-the-badge&logo=github" alt="Estado">
  <img src="https://img.shields.io/badge/Tecnolog%C3%ADa-HTML5%20%7C%20CSS3%20%7C%20JS%20Vanilla-orange?style=for-the-badge&logo=javascript" alt="Tecnologías">
  <img src="https://img.shields.io/badge/Deploy-GitHub%20Pages-blue?style=for-the-badge&logo=githubpages" alt="GitHub Pages">
  <img src="https://img.shields.io/badge/Certificados-Canvas%202D%20%2B%20jsPDF-red?style=for-the-badge" alt="Certificados">
</p>

---

## 📖 Acerca del Proyecto

Con motivo de la celebración del **9º Aniversario de La Martina (Amor por la Cocina)** junto a la **Chef Instructor Martha Guzmán**, se ha desarrollado esta plataforma web estática optimizada para **GitHub Pages**. 

Su propósito central es ofrecer a los alumnos y participantes una experiencia intuitiva, atractiva y rápida para:
1. **Acceder a la transmisión en vivo** del taller en el grupo privado de Facebook.
2. **Descargar el material académico oficial** (Cronograma de tiempos y Recetario maestro completo).
3. **Emitir y descargar su Certificado Oficial de 5 horas** en tiempo real, personalizado con su nombre, código de folio único y guardado en su propio dispositivo.
4. **Explorar el catálogo digital** de otros cursos y recetarios especializados.

---

## ✨ Características Principales

### 1. 🎓 Generador de Certificados 100% en Cliente (JavaScript)
- **Migración total desde Python:** Anteriormente basado en scripts de escritorio con ReportLab/PIL, ahora funciona íntegramente en el navegador mediante la **API Canvas 2D**.
- **Previsualización en Tiempo Real:** A medida que el alumno teclea su nombre, el certificado se actualiza letra por letra con la tipografía artística **Madina**.
- **Auto-escalado inteligente:** Algoritmo que ajusta dinámicamente el tamaño de la fuente para nombres largos, evitando que el texto sobrepase los márgenes.
- **Resolución Máxima para Impresión:** Renderizado a resolución nativa de **3300 × 2550 píxeles** (11 × 8.5 pulgadas a 300 DPI).
- **Código de Folio Único:** Generación de identificador de autenticación (ej. `LM-9NO-4821-K9X2`) sellado en el certificado.
- **Doble formato de descarga:**
  - 🖼️ **Imagen HD (JPG):** Ideal para compartir en redes sociales y guardar en galería.
  - 📄 **Documento PDF (Carta horizontal):** Generado vía `jsPDF` con dimensiones estándar (792 × 612 pt) listo para imprimir.
- **Persistencia en `localStorage`:** Evita emisiones repetidas, conservando el certificado y su folio registrado en el dispositivo del usuario.
- **Opción de corrección:** Permite editar el nombre en caso de error ortográfico sin perder el folio asignado.
- **Animación festiva:** Lluvia de confeti celebratorio al emitir el documento.

### 2. 📥 Descarga de Material Didáctico
- **Cronograma Oficial del Taller (PDF - 328 KB):** Estructura del taller, tiempos de cocción, enfriamiento y orden de las recetas.
- **Recetario Completo "Postres Económicos y Ricos" (PDF - 20.1 MB):** Recetas detalladas, ingredientes, costos y técnicas de preparación.
- Botones de **descarga directa** y de **visualización en línea** en nueva pestaña.

### 3. 🔴 Enlaces Oficiales Integrados
- **Transmisión en Vivo:** Acceso directo al [Grupo Privado de Facebook](https://www.facebook.com/groups/1278737036244709).
- **Catálogo Web de Cursos:** Conexión con el [Catálogo Virtual La Martina](https://wilegro.github.io/catalogo-web/).

### 4. 🎨 Diseño Culinario Moderno y Responsivo
- Paleta festiva acorde a la identidad de La Martina: rojo cereza (`#C5131A`), dorado champagne (`#E5A922`), fondos cálidos y detalles suaves.
- Tipografías integradas: *Playfair Display* (títulos), *Outfit* / *Montserrat* (interfaz) y *Madina* (caligrafía del certificado).
- Tipografía *Madina* incrustada en **Base64 Data URI** dentro de `style.css` para garantizar carga instantánea con **cero errores de CORS**, tanto en local como en GitHub Pages.
- Adaptable a cualquier dispositivo: móviles, tablets y computadoras de escritorio.

---

## 📁 Estructura del Directorio

```text
web/
├── index.html                                        # Estructura semántica principal
├── README.md                                         # Documentación del proyecto
└── assets/
    ├── css/
    │   └── style.css                                 # Diseño visual, variables y fuente Base64
    ├── js/
    │   ├── certificate.js                            # Motor del certificado (Canvas 2D + jsPDF)
    │   └── app.js                                    # Navegación móvil, toasts y eventos
    ├── img/
    │   ├── logo.png                                  # Logo circular transparente
    │   ├── banner-aniversario.jpg                    # Arte gráfico del 9º Aniversario
    │   └── certificado-plantilla.jpg                 # Plantilla original de alta resolución
    ├── fonts/                                        # Tipografías TTF de respaldo
    └── material/
        ├── Cronograma-Postres-Economicos-y-Ricos.pdf # Documento PDF del cronograma
        └── Recetario-Postres-Economicos-y-Ricos.pdf  # Documento PDF del recetario oficial
```

---

## 🚀 Despliegue en GitHub Pages

Para publicar este proyecto en tu cuenta de GitHub Pages:

### Paso 1: Inicializar repositorio Git local
Abre una terminal en la carpeta `web` y ejecuta:

```bash
git init
git add .
git commit -m "feat: Lanzamiento web 9no Aniversario La Martina y generador de certificados"
```

### Paso 2: Vincular con tu repositorio remoto en GitHub
Crea un repositorio en GitHub (ejemplo: `9no-aniversario-la-martina`) y vincúlalo:

```bash
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

### Paso 3: Activar GitHub Pages
1. Ingresa a tu repositorio en GitHub.
2. Ve a **Settings** (Configuración) > **Pages** (en el menú lateral izquierdo).
3. En **Build and deployment > Source**, selecciona **Deploy from a branch**.
4. En **Branch**, selecciona `main` y la carpeta `/ (root)`.
5. Haz clic en **Save** (Guardar).
6. En un par de minutos tu sitio estará en vivo en:  
   `https://TU_USUARIO.github.io/TU_REPOSITORIO/`

---

## 🛠️ Tecnologías Utilizadas

- **HTML5 Semántico:** Marcado accesible con metaetiquetas OpenGraph para redes sociales.
- **CSS3:** Variables CSS, Flexbox, Grid layout y efectos de glassmorphism.
- **JavaScript Vanilla (ES6+):** Sin frameworks pesados; rápida velocidad de carga y rendimiento óptimo.
- **HTML5 Canvas API:** Manipulación gráfica y renderizado de texto en alta definición.
- **[jsPDF](https://github.com/parallax/jsPDF):** Exportación de certificados a PDF de forma nativa en cliente.
- **[Canvas Confetti](https://github.com/catdad/canvas-confetti):** Efectos visuales de celebración.
- **[Font Awesome 6](https://fontawesome.com/):** Iconografía moderna para la interfaz.

---

## 👩‍🍳 Créditos y Derechos

- **Organización:** [La Martina - Amor por la Cocina](https://www.facebook.com/groups/1278737036244709)
- **Chef Instructor:** Martha Guzmán
- **Catálogo de Cursos:** [wilegro.github.io/catalogo-web](https://wilegro.github.io/catalogo-web/)
- **Edición y Desarrollo:** 9º Aniversario © 2026. Todos los derechos reservados.
