# YouTube Music – Vinyl Player 🎵💿

A Tampermonkey userscript that transforms the album artwork on **YouTube Music** into a rotating vinyl record.  
It includes customizable options for vinyl size, grooves, halo effects, rotation speed/direction, and a central label with optional artwork or color.

---

Features:
- Replaces album artwork with a **rotating vinyl disc**.  
- **Configurable CSS variables** for:
  - Vinyl size, brightness, and halo glow.  
  - Groove spacing, width, and opacity.  
  - Spin speed, direction, and animation curve.  
  - Label (color or custom image) and spindle hole size.  
- Works directly on [YouTube Music](https://music.youtube.com).  

---

Requirements:
This script requires [Tampermonkey](https://www.tampermonkey.net/) (or a compatible userscript manager).  

- **Chrome / Edge / Brave / Opera** → [Tampermonkey extension](https://www.tampermonkey.net/?ext=dhdg&browser=chrome)  
- **Firefox** → [Tampermonkey for Firefox](https://www.tampermonkey.net/?ext=dhdg&browser=firefox)  
- **Safari** → [Tampermonkey for Safari](https://www.tampermonkey.net/?ext=dhdg&browser=safari)  

---

Installation:
1. Install Tampermonkey from the links above.  
2. Open the raw script link:

3. Tampermonkey will detect it and ask you to **Install**.  

---

## ⚙️ Configuration
You can customize the vinyl by editing the CSS variables at the top of the script, for example:

```css
:root {
--vinyl-scale: 0.85;        /* Vinyl size */
--spin-seconds: 60s;        /* Rotation duration */
--spin-direction: reverse;  /* normal | reverse */
--groove-spacing: 42px;     /* Distance between grooves */
--label-image: url("https://..."); /* Central label image */
--spindle-hole: 14%;        /* Size of spindle hole */
}
