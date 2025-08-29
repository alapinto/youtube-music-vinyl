// @downloadURL  https://raw.githubusercontent.com/alapinto/youtube-music-vinyl/main/src/youtube-music-vinyl.user.js
// @updateURL    https://raw.githubusercontent.com/alapinto/youtube-music-vinyl/main/src/youtube-music-vinyl.user.js
// ==UserScript==
// @name         YouTube Music - Vinilo giratorio optimizado (fix círculo)
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Spinning vinyl, with texture, and customization
// @author       ALAPINTO
// @match        https://music.youtube.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const CSS = `
    :root {

/* ==== Customizable Variables (adjust to personalize the vinyl ==== */

      /* Vinyl size and position */
      --vinyl-scale: 0.85;
      --vinyl-padding: 22px;
      --vinyl-shift-y: -8px;

      /* Animation */
      --spin-seconds: 15s;
      --spin-direction: normal;      /* normal | reverse */

      /* Vinyl color */
      --vinyl-color: #1a1a1a;
      --vinyl-brightness: 0.98;

      /* Label */
      --label-size: 35%;
      --label-use-image: 1; /* 1 = imagen, 0 = color sólido */
      --label-image: url("https://i1.sndcdn.com/artworks-x8zI2HVC2pnkK7F5-4xKLyA-t500x500.jpg");
      --label-image-size: 100%;
      --label-fallback-color: #ffffff;
      --label-fallback-size: 100%;
      --label-fallback-brightness: 1.1;

      /* Central hole */
      --spindle-hole: 4%;  /* relativo al diámetro de la etiqueta */

      /* Color overlay */
      --vinyl-overlay-color: 255,0,0;
      --vinyl-overlay-opacity: 0.15;

      /* Surcos */
      --groove-spacing: 42px;
      --groove-width: 0.6px;
      --groove-opacity: 0.12;

      /* Effects */
      --halo-color: 255,255,255;
      --halo-opacity: 1;
      --disc-shadow: 0 0 25px rgba(0,0,0,0.8);
    }

/* ==== Advanced Configuration — do not modify unless you know what you're doing ==== */

    @keyframes vinyl-spin {
      from { transform: rotate(0deg) scale(var(--vinyl-scale)); }
      to   { transform: rotate(360deg) scale(var(--vinyl-scale)); }
    }

    #song-image { background: #000 !important; position: relative !important; }

    #song-image > *:not(.vinyl-container) {
      opacity: 0 !important;
      visibility: hidden !important;
    }

    .vinyl-container {
      position: absolute !important;
      left: 50% !important;
      top: 50% !important;
      transform: translate(-50%, calc(-50% + var(--vinyl-shift-y))) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 1000 !important;
      pointer-events: none !important;
    }

    .vinyl-disc {
      width: 100% !important;
      height: 100% !important;
      border-radius: 50% !important;
      position: relative !important;
      background: var(--vinyl-color) !important;
      animation: vinyl-spin var(--spin-seconds) infinite !important;
      animation-direction: var(--spin-direction) !important;
      overflow: hidden !important;
      box-shadow:
        0 0 20px rgba(var(--halo-color), var(--halo-opacity)),
        0 0 40px rgba(var(--halo-color), calc(var(--halo-opacity) * 0.6)),
        inset 0 0 20px rgba(0,0,0,0.3),
        var(--disc-shadow) !important;
    }

    .vinyl-artwork {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
      border-radius: 50% !important;
      filter: brightness(var(--vinyl-brightness)) !important;
      z-index: 1 !important;
    }

    .vinyl-overlay {
      position: absolute !important;
      inset: 0 !important;
      background: rgba(var(--vinyl-overlay-color), var(--vinyl-overlay-opacity)) !important;
      border-radius: 50% !important;
      mix-blend-mode: multiply !important;
      z-index: 2 !important;
    }

    .vinyl-grooves {
      position: absolute !important;
      inset: 0 !important;
      border-radius: 50% !important;
      background: repeating-radial-gradient(
        circle at center,
        rgba(255,255,255,var(--groove-opacity)) 0,
        rgba(255,255,255,var(--groove-opacity)) var(--groove-width),
        transparent var(--groove-width),
        transparent var(--groove-spacing)
      ) !important;
      z-index: 3 !important;
    }

    .vinyl-center-mask {
      position: absolute !important;
      left: 50% !important;
      top: 50% !important;
      width: calc(var(--label-size) + 2px) !important;
      height: calc(var(--label-size) + 2px) !important;
      transform: translate(-50%, -50%) !important;
      background: var(--vinyl-color) !important;
      border-radius: 50% !important;
      z-index: 4 !important;
    }

    .vinyl-label {
      position: absolute !important;
      left: 50% !important;
      top: 50% !important;
      width: var(--label-size) !important;
      height: var(--label-size) !important;
      transform: translate(-50%, -50%) !important;
      border-radius: 50% !important;
      z-index: 5 !important;
      box-shadow:
        inset 0 0 0 1px rgba(0,0,0,0.2),
        inset 0 0 8px rgba(0,0,0,0.3),
        0 0 6px rgba(0,0,0,0.4) !important;
      overflow: hidden !important;
    }

    .vinyl-label.has-image {
      background: var(--label-image) no-repeat center !important;
      background-size: var(--label-image-size) !important;
    }

    .vinyl-label.has-color::before {
      content: '' !important;
      position: absolute !important;
      left: 50% !important;
      top: 50% !important;
      width: var(--label-fallback-size) !important;
      height: var(--label-fallback-size) !important;
      transform: translate(-50%, -50%) !important;
      background: var(--label-fallback-color) !important;
      filter: brightness(var(--label-fallback-brightness)) !important;
      border-radius: 50% !important;
    }

    .vinyl-hole {
      position: absolute !important;
      left: 50% !important;
      top: 50% !important;
      width: var(--spindle-hole) !important;
      height: var(--spindle-hole) !important;
      transform: translate(-50%, -50%) !important;
      background: #000 !important;
      border-radius: 50% !important;
      z-index: 6 !important;
      box-shadow:
        inset 0 0 0 1px rgba(255,255,255,0.08),
        inset 0 0 4px rgba(0,0,0,0.6) !important;
    }

    ytmusic-player-bar img.image.spinning {
      animation: vinyl-spin var(--spin-seconds) infinite !important;
      animation-direction: var(--spin-direction) !important;
      border-radius: 50% !important;
    }
  `;

  function injectStyles() {
    let style = document.getElementById('vinyl-optimized');
    if (!style) {
      style = document.createElement('style');
      style.id = 'vinyl-optimized';
      document.head.appendChild(style);
    }
    style.textContent = CSS;
  }

  let vinylContainer, currentSrc, updateTimeout;

  function sizeSquareToHost(container, host) {
    const pad = parseFloat(getComputedStyle(document.documentElement)
      .getPropertyValue('--vinyl-padding')) || 0;

    const w = host.clientWidth;
    const h = host.clientHeight;
    const size = Math.max(0, Math.min(w, h) - pad * 2);

    container.style.width = size + 'px';
    container.style.height = size + 'px';
  }

  function createVinyl() {
    const host = document.getElementById('song-image');
    const originalImg = host?.querySelector('img');
    if (!host || !originalImg?.src || originalImg.src === currentSrc) return;

    vinylContainer?.remove();

    vinylContainer = document.createElement('div');
    vinylContainer.className = 'vinyl-container';
    sizeSquareToHost(vinylContainer, host);

    const disc = document.createElement('div');
    disc.className = 'vinyl-disc';

    const artwork = document.createElement('img');
    artwork.src = originalImg.src;
    artwork.className = 'vinyl-artwork';
    artwork.alt = 'Vinyl Record';

    const overlay = document.createElement('div');
    overlay.className = 'vinyl-overlay';

    const grooves = document.createElement('div');
    grooves.className = 'vinyl-grooves';

    const centerMask = document.createElement('div');
    centerMask.className = 'vinyl-center-mask';

    const label = document.createElement('div');
    label.className = 'vinyl-label';

    const useImage = getComputedStyle(document.documentElement)
      .getPropertyValue('--label-use-image').trim();
    if (useImage === '1') label.classList.add('has-image'); else label.classList.add('has-color');

    const hole = document.createElement('div');
    hole.className = 'vinyl-hole';

    disc.appendChild(artwork);
    disc.appendChild(overlay);
    disc.appendChild(grooves);
    disc.appendChild(centerMask);
    disc.appendChild(label);
    disc.appendChild(hole);

    vinylContainer.appendChild(disc);
    host.appendChild(vinylContainer);

    currentSrc = originalImg.src;

    document.querySelectorAll('ytmusic-player-bar img.image')
      .forEach(el => el.classList.add('spinning'));
  }

  function scheduleUpdate() {
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
      const host = document.getElementById('song-image');
      if (vinylContainer && host) sizeSquareToHost(vinylContainer, host);
      createVinyl();
    }, 300);
  }

  injectStyles();
  createVinyl();

  const resizeObserver = new ResizeObserver(() => {
    const host = document.getElementById('song-image');
    if (vinylContainer && host) sizeSquareToHost(vinylContainer, host);
  });
  const hostEl = document.getElementById('song-image');
  if (hostEl) resizeObserver.observe(hostEl);

  const observer = new MutationObserver(mutations => {
    if (mutations.some(m =>
      (m.type === 'attributes' && m.attributeName === 'src' && m.target.closest('#song-image')) ||
      (m.type === 'childList' && Array.from(m.addedNodes).some(n =>
        n.nodeType === 1 && (n.id === 'song-image' || n.querySelector?.('#song-image'))
      ))
    )) scheduleUpdate();
  });
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });

  ['yt-navigate-finish', 'yt-page-data-updated']
    .forEach(event => document.addEventListener(event, scheduleUpdate));

  console.log('YouTube Music Vinyl — círculo perfecto aplicado');
})();




