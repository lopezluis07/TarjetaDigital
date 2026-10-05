# Tarjetas digitales Colomich

Sitio: https://tarjeta.operamich.com · Hospedado en GitHub Pages · DNS en AWS Lightsail (operamich.com)

## Estructura
- `assets/css/tarjeta.css` — diseño compartido (cambiarlo afecta todas las tarjetas)
- `assets/js/tarjeta.js` — lógica compartida: contacto .vcf, QR, idioma, compartir
- `assets/img/` — logo y favicon compartidos
- `_plantilla/` — plantilla para personas nuevas (no se publica)
- `nombre-apellido/` — una carpeta por persona

## Agregar una persona
1. Copia `_plantilla/` y renómbrala `nombre-apellido` (minúsculas, sin tildes ni espacios).
2. En su `index.html` cambia el `<title>`, las etiquetas `og:` (incluida la URL) y el bloque `window.CONFIG`.
3. Opcional: agrega `foto.jpg` (300×300 px, < 50 KB) y escribe `photo: "foto.jpg"`.
4. Commit y push. URL final: `https://tarjeta.operamich.com/nombre-apellido/`
5. Genera el QR con esa URL exacta (con la barra final).

## Retirar una persona
No borres la carpeta (los QR impresos quedarían rotos). Reemplaza su `index.html` por una redirección a https://www.colomichsas.com/.
