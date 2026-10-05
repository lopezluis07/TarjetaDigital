/* =====================================================================
   Lógica compartida de todas las tarjetas.
   Cada persona define window.CONFIG en su propio index.html.
   ===================================================================== */
(function () {
  const CONFIG = window.CONFIG;
  const LOGO = "/assets/img/logo.png";

  const TEXT = {
    es: { save: "Guardar contacto", call: "Llamar", whatsapp: "WhatsApp", email: "Correo",
          website: "Sitio web", linkedin: "LinkedIn", location: "Ubicación", online: "En línea",
          showQr: "Mostrar QR", share: "Compartir",
          qrHint: "Pide que escaneen este código con la cámara del celular.",
          close: "Cerrar", copied: "Enlace copiado", saved: "Contacto descargado" },
    en: { save: "Save contact", call: "Call", whatsapp: "WhatsApp", email: "Email",
          website: "Website", linkedin: "LinkedIn", location: "Location", online: "Online",
          showQr: "Show QR", share: "Share",
          qrHint: "Ask them to scan this code with their phone camera.",
          close: "Close", copied: "Link copied", saved: "Contact downloaded" }
  };

  const ICONS = {
    call: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
    whatsapp: '<path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.3z"/><path d="M9 10c0 3 2 5 5 5l1.2-1.2-2-1-1 .8c-.8-.4-1.4-1-1.8-1.8l.8-1-1-2z"/>',
    location: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    website: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>'
  };

  /* Agrega más banderas aquí si se necesitan otros países */
  const FLAGS = {
    co: '<svg class="flag" viewBox="0 0 6 4" aria-hidden="true"><rect width="6" height="2" fill="#FCD116"/><rect y="2" width="6" height="1" fill="#003893"/><rect y="3" width="6" height="1" fill="#CE1126"/></svg>',
    mx: '<svg class="flag" viewBox="0 0 6 4" aria-hidden="true"><rect width="2" height="4" fill="#006847"/><rect x="2" width="2" height="4" fill="#fff"/><rect x="4" width="2" height="4" fill="#CE1126"/><circle cx="3" cy="2" r=".45" fill="#8c6b2f"/></svg>',
    us: '<svg class="flag" viewBox="0 0 6 4" aria-hidden="true"><rect width="6" height="4" fill="#B22234"/><g fill="#fff"><rect y=".6" width="6" height=".3"/><rect y="1.2" width="6" height=".3"/><rect y="1.8" width="6" height=".3"/><rect y="2.4" width="6" height=".3"/><rect y="3" width="6" height=".3"/><rect y="3.6" width="6" height=".3"/></g><rect width="2.6" height="2.1" fill="#3C3B6E"/></svg>'
  };

  const CONTOURS = `<svg class="contours" viewBox="0 0 440 170" preserveAspectRatio="none" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.2">
    <path d="M-10 150 C 60 110, 120 140, 190 100 S 330 60, 450 90"/><path d="M-10 128 C 70 92, 130 118, 200 80 S 330 42, 450 66"/>
    <path d="M-10 106 C 80 74, 140 96, 210 60 S 335 24, 450 44"/><path d="M-10 84 C 90 56, 150 74, 220 40 S 340 8, 450 22"/>
    <path d="M-10 62 C 100 38, 160 52, 230 20 S 345 -8, 450 0"/><path d="M-10 40 C 110 20, 170 30, 240 0"/></svg>`;

  const $ = (id) => document.getElementById(id);
  const digits = (s) => "+" + String(s).replace(/\D/g, "");
  const vEsc = (s) => String(s || "").replace(/([\\,;])/g, "\\$1");
  const esc = (s) => String(s || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const svg = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const fullName = `${CONFIG.firstName} ${CONFIG.lastName}`;
  let lang = (navigator.language || "es").toLowerCase().startsWith("es") ? "es" : "en";

  /* Estructura de la tarjeta (igual para todos) */
  document.getElementById("app").innerHTML = `
    <main class="card">
      <header class="hero">${CONTOURS}
        <div class="topbar"><button class="chip" id="langBtn" aria-label="Cambiar idioma">EN</button></div>
        <div class="avatar" id="avatar"></div>
      </header>
      <section class="identity">
        <h1 class="name" id="name"></h1>
        <p class="role" id="role"></p>
        <p class="org" id="org"></p>
      </section>
      <button class="primary" id="saveBtn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>
        <span data-i18n="save"></span>
      </button>
      <div id="links"></div>
      <footer class="footer">
        <button class="secondary" id="qrBtn" data-i18n="showQr"></button>
        <button class="secondary" id="shareBtn" data-i18n="share"></button>
      </footer>
    </main>
    <dialog id="qrDialog">
      <div id="qr"></div>
      <p data-i18n="qrHint"></p>
      <button class="secondary" id="closeQr" style="width:100%" data-i18n="close"></button>
    </dialog>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>`;

  function render() {
    const t = TEXT[lang];
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(el => el.textContent = t[el.dataset.i18n]);
    $("langBtn").textContent = lang === "es" ? "EN" : "ES";
    $("role").textContent = CONFIG.role[lang];

    const list = (items) => `<ul class="links">${items
      .filter(([, href, val]) => href && val)
      .map(([key, href, val]) => `
        <li><a href="${esc(href)}" ${href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>
          <span class="icon">${svg(ICONS[key])}</span>
          <span><span class="label">${t[key]}</span><span class="value">${esc(val)}</span></span>
        </a></li>`).join("")}</ul>`;

    const countries = CONFIG.countries.map(c => {
      const place = [c.city, c.region].filter(Boolean).join(", ");
      return `<div class="group-title">${FLAGS[c.flag] || ""}${esc(c.name[lang])}</div>` + list([
        ["call",     c.phone && `tel:${digits(c.phone)}`, c.phone],
        ["whatsapp", c.whatsapp && `https://wa.me/${digits(c.whatsapp).slice(1)}`, c.whatsapp],
        ["location", place && `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place + ", " + c.name.es)}`, place]
      ]);
    }).join("");

    $("links").innerHTML = countries + `<div class="group-title">${t.online}</div>` + list([
      ["email",    CONFIG.email && `mailto:${CONFIG.email}`, CONFIG.email],
      ["website",  CONFIG.website,  (CONFIG.website || "").replace(/^https?:\/\//, "")],
      ["linkedin", CONFIG.linkedin, (CONFIG.linkedin || "").replace(/^https?:\/\/(www\.)?/, "")]
    ]);

    $("org").textContent = [CONFIG.org, ...CONFIG.countries.map(c => c.name[lang])].join(" · ");
  }

  function init() {
    $("name").textContent = fullName;
    const img = CONFIG.photo || LOGO;
    $("avatar").classList.toggle("is-logo", !CONFIG.photo);
    $("avatar").innerHTML = `<img src="${esc(img)}" alt="${esc(CONFIG.photo ? fullName : CONFIG.org)}">`;
    render();
  }

  function saveContact() {
    const vcf = [
      "BEGIN:VCARD", "VERSION:3.0",
      `N:${vEsc(CONFIG.lastName)};${vEsc(CONFIG.firstName)};;;`,
      `FN:${vEsc(fullName)}`,
      `ORG:${vEsc(CONFIG.org)}`,
      `TITLE:${vEsc(CONFIG.role[lang])}`,
      ...[...new Set(CONFIG.countries.flatMap(c => [c.phone, c.whatsapp]).filter(Boolean).map(digits))]
        .map(n => `TEL;TYPE=CELL:${n}`),
      ...CONFIG.countries.map(c => `ADR;TYPE=WORK:;;;${vEsc(c.city)};${vEsc(c.region)};;${vEsc(c.name.es)}`),
      CONFIG.email    && `EMAIL;TYPE=INTERNET:${CONFIG.email}`,
      CONFIG.website  && `URL:${CONFIG.website}`,
      CONFIG.linkedin && `URL;TYPE=LinkedIn:${CONFIG.linkedin}`,
      `NOTE:${location.href}`,
      "END:VCARD"
    ].filter(Boolean).join("\r\n");

    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([vcf], { type: "text/vcard;charset=utf-8" }));
    a.download = `${location.pathname.split("/").filter(Boolean).pop() || "contacto"}.vcf`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast(TEXT[lang].saved);
  }

  function toast(msg) {
    const el = $("toast"); el.textContent = msg; el.classList.add("show");
    clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("show"), 2200);
  }

  let qrDone = false;
  function showQr() {
    if (!qrDone && window.QRCode) {
      new QRCode($("qr"), { text: location.origin + location.pathname, width: 440, height: 440,
        colorDark: "#1C2B22", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M });
      qrDone = true;
    }
    $("qrDialog").showModal();
  }

  async function share() {
    const url = location.origin + location.pathname;
    if (navigator.share) { try { await navigator.share({ title: fullName, text: CONFIG.role[lang], url }); } catch (e) {} return; }
    try { await navigator.clipboard.writeText(url); toast(TEXT[lang].copied); } catch (e) {}
  }

  init();
  $("langBtn").onclick = () => { lang = lang === "es" ? "en" : "es"; render(); };
  $("saveBtn").onclick = saveContact;
  $("qrBtn").onclick = showQr;
  $("closeQr").onclick = () => $("qrDialog").close();
  $("shareBtn").onclick = share;
})();
