/* ============================================================
   CONFIGURACIÓN: edita solo este bloque
   ============================================================ */
const CONFIG = {
  whatsapp: "593968548680",          // código de país + número, sin + ni espacios
  email: "neydermayorga@gmail.com",
  github: "",                        // ej: "https://github.com/tu-usuario" (vacío = se oculta)
  linkedin: ""                        // ej: "https://linkedin.com/in/tu-usuario" (vacío = se oculta)
};

// Solo pon herramientas que realmente hayas usado.
const TOOLS = ["HTML", "CSS", "GitHub", "Claude Code"];

const PROJECTS = [
  {
    title: "Cheesely, postres artesanales",
    kind: "Proyecto personal",
    description: "Sitio para una marca de postres artesanales: menú de favoritos con precios, galería, historia de la marca y formulario de contacto.",
    tech: ["HTML", "CSS"],
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=900",
    imageAlt: "Cheesecake de la página de Cheesely",
    demo: "https://cheesely.netlify.app/",
    code: ""
  },
  {
    title: "Grupo Protector Animal Claudia Poppe",
    kind: "Proyecto de protección animal",
    description: "Sitio desarrollado para un grupo de rescate animal (aún no puesto en uso por la organización): animales en adopción, formularios de adopción, hogar temporal, donaciones y mapa con la ubicación.",
    tech: ["HTML", "CSS"],
    image: "https://gpaclaupoppe.netlify.app/img/logogpa.jpg",
    logo: true,
    imageAlt: "Logo del Grupo Protector Animal Claudia Poppe",
    demo: "https://gpaclaupoppe.netlify.app/",
    code: ""
  }
];

/* ============================================================
   CÓDIGO (no necesitas tocar nada de aquí hacia abajo)
   ============================================================ */
const $ = (s) => document.querySelector(s);
function el(tag, props = {}, kids = []) {
  const n = document.createElement(tag);
  Object.assign(n, props);
  [].concat(kids).forEach((k) => n.append(k));
  return n;
}

function renderProjects() {
  PROJECTS.forEach((p) => {
    const shot = p.image
      ? el("img", { src: p.image, alt: p.imageAlt || p.title, loading: "lazy", className: p.logo ? "logo" : "" })
      : document.createTextNode("Captura pendiente");
    const links = el("div", { className: "plinks" });
    if (p.demo) links.append(el("a", { href: p.demo, target: "_blank", rel: "noopener", textContent: "Ver proyecto" }));
    if (p.code) links.append(el("a", { href: p.code, target: "_blank", rel: "noopener", textContent: "Ver código" }));
    $("#projects").append(el("article", { className: "project reveal" }, [
      el("div", { className: "frame-b" }, [
        el("div", { className: "bar" }, [el("i"), el("i"), el("i")]),
        el("div", { className: "shot" }, shot)
      ]),
      el("div", { className: "meta" }, [el("h3", { textContent: p.title }), el("span", { className: "kind", textContent: p.kind })]),
      el("p", { textContent: p.description }),
      el("ul", { className: "tags" }, p.tech.map((t) => el("li", { textContent: t }))),
      links
    ]));
  });
}

function setupWhatsApp() {
  const url = `https://wa.me/${CONFIG.whatsapp}?text=` + encodeURIComponent("Hola Neyder, vi tu portafolio y me gustaría hablar de un proyecto.");
  document.querySelectorAll("[data-wa]").forEach((a) => { a.href = url; a.target = "_blank"; a.rel = "noopener"; });
}

function setupMisc() {
  TOOLS.forEach((t) => $("#tools").append(el("li", { textContent: t })));
  $("#rail-mail").href = "mailto:" + CONFIG.email;
  $("#rail-mail").textContent = CONFIG.email;
  $("#mail-link").href = "mailto:" + CONFIG.email;
  $("#mail-link").textContent = CONFIG.email;
  [["#gh-link", CONFIG.github], ["#li-link", CONFIG.linkedin]].forEach(([s, u]) => {
    const a = $(s); if (u) a.href = u; else a.hidden = true;
  });
}

function setupForm() {
  const f = $("#contact-form"), err = $("#form-error"), ok = $("#form-ok"), btn = $("#form-btn");
  const waUrl = `https://wa.me/${CONFIG.whatsapp}`;
  f.addEventListener("submit", async (e) => {
    e.preventDefault();
    ok.hidden = true;
    const name = f.name.value.trim(), phone = f.phone.value.trim(), msg = f.msg.value.trim();
    if (f._honey.value) return;                       // anti-spam
    if (!name || !msg || phone.replace(/\D/g, "").length < 7) {
      err.textContent = "Completa tu nombre, un número de contacto válido y una breve descripción.";
      err.hidden = false; return;
    }
    err.hidden = true;
    btn.disabled = true; btn.textContent = "Enviando...";
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONFIG.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          "Nombre": name,
          "Número de contacto": phone,
          "Qué necesita": f.type.value,
          "Descripción del proyecto": msg,
          _subject: `Nuevo proyecto desde tu portafolio: ${name}`,
          _template: "table",
          _captcha: "false"
        })
      });
      const data = await res.json();
      if (!res.ok || String(data.success) !== "true") throw new Error(data.message || "Error al enviar");
      f.reset(); ok.hidden = false;
    } catch (_) {
      err.innerHTML = `No se pudo enviar el mensaje. Escríbeme directo por <a href="${waUrl}" target="_blank" rel="noopener">WhatsApp</a>.`;
      err.hidden = false;
    } finally {
      btn.disabled = false; btn.textContent = "Enviar mi idea";
    }
  });
}

function setupTopbar() {
  const bar = $("#topbar"), hero = $("#inicio");
  const update = () => bar.classList.toggle("light", window.scrollY > hero.offsetHeight - 90);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function setupObservers() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((n) => io.observe(n));

  const links = [...document.querySelectorAll(".topbar a")];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) links.forEach((a) => a.setAttribute("aria-current", String(a.getAttribute("href") === "#" + e.target.id)));
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  document.querySelectorAll("main section").forEach((s) => spy.observe(s));
}

renderProjects();
setupWhatsApp();
setupMisc();
setupForm();
setupObservers();
setupTopbar();
