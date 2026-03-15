/**
 * UI + detector (educacional)
 * - visual: cartão 3D, logo inline (SVG), estados e feedback do Luhn
 */

function onlyDigits(value) {
  return String(value || "").replace(/\D+/g, "");
}

function formatGroups(digits) {
  if (digits.length === 15) {
    // Amex (4-6-5)
    return digits.replace(/^(\d{4})(\d{6})(\d{0,5}).*$/, (_, a, b, c) => [a, b, c].filter(Boolean).join(" "));
  }
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function luhnCheck(digits) {
  if (!/^\d+$/.test(digits)) return false;
  let sum = 0;
  let doubleIt = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let n = digits.charCodeAt(i) - 48;
    if (doubleIt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    doubleIt = !doubleIt;
  }

  return sum % 10 === 0;
}

function detectBrand(digits) {
  if (!digits) return null;

  // Visa 16 dígitos
  if (/^4\d{15}$/.test(digits)) return { brand: "Visa (16)", code: "visa16" };

  // MasterCard: 51–55 ou 2221–2720, 16 dígitos
  if (/^(5[1-5]\d{14})$/.test(digits)) return { brand: "MasterCard", code: "mastercard" };
  const first4 = Number(digits.slice(0, 4));
  if (digits.length === 16 && first4 >= 2221 && first4 <= 2720) return { brand: "MasterCard", code: "mastercard" };

  // American Express: 34 ou 37, 15 dígitos
  if (/^3[47]\d{13}$/.test(digits)) return { brand: "American Express", code: "amex" };

  // Diners Club: 300–305, 36, 38, 39 (comum 14)
  if (/^(30[0-5]\d{11}|36\d{12}|3[89]\d{12})$/.test(digits)) return { brand: "Diners Club", code: "diners" };

  // Discover: 6011, 65, 644-649, 622126-622925
  if (/^(6011\d{12}|65\d{14}|64[4-9]\d{13})$/.test(digits)) return { brand: "Discover", code: "discover" };
  if (digits.length === 16) {
    const first6 = Number(digits.slice(0, 6));
    if (first6 >= 622126 && first6 <= 622925) return { brand: "Discover", code: "discover" };
  }

  // EnRoute: 2014 ou 2149 (15)
  if (/^(2014|2149)\d{11}$/.test(digits)) return { brand: "EnRoute", code: "enroute" };

  // JCB: 3528–3589 (16)
  if (digits.length === 16) {
    const jcbPrefix = Number(digits.slice(0, 4));
    if (jcbPrefix >= 3528 && jcbPrefix <= 3589) return { brand: "JCB", code: "jcb" };
  }

  // Voyager: 8699 (15)
  if (/^8699\d{11}$/.test(digits)) return { brand: "Voyager", code: "voyager" };

  // HiperCard: 38 ou 60 (varia)
  if (/^(38|60)\d{11,17}$/.test(digits)) return { brand: "HiperCard", code: "hipercard" };

  // Aura: 50 (varia)
  if (/^50\d{11,17}$/.test(digits)) return { brand: "Aura", code: "aura" };

  return null;
}

/** Logos simples em SVG (sem dependências externas). */
function logoSVG(code) {
  const common = `width="86" height="28" viewBox="0 0 86 28" xmlns="http://www.w3.org/2000/svg"`;

  switch (code) {
    case "visa16":
      return `
        <svg ${common} aria-label="Visa">
          <defs>
            <linearGradient id="v" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#60a5fa"/>
              <stop offset="1" stop-color="#1d4ed8"/>
            </linearGradient>
          </defs>
          <rect x="0.5" y="0.5" width="85" height="27" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)"/>
          <text x="16" y="19" font-size="14" font-family="ui-sans-serif, system-ui" font-weight="800" fill="url(#v)">VISA</text>
        </svg>
      `;
    case "mastercard":
      return `
        <svg ${common} aria-label="MasterCard">
          <rect x="0.5" y="0.5" width="85" height="27" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)"/>
          <circle cx="38" cy="14" r="7.5" fill="#ef4444" opacity="0.92"/>
          <circle cx="48" cy="14" r="7.5" fill="#f59e0b" opacity="0.92"/>
          <text x="58.5" y="17" font-size="9.5" font-family="ui-sans-serif, system-ui" font-weight="700" fill="rgba(229,231,235,0.9)">MC</text>
        </svg>
      `;
    case "amex":
      return `
        <svg ${common} aria-label="American Express">
          <defs>
            <linearGradient id="a" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#22c55e"/>
              <stop offset="1" stop-color="#0ea5e9"/>
            </linearGradient>
          </defs>
          <rect x="0.5" y="0.5" width="85" height="27" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)"/>
          <text x="10" y="18" font-size="11.5" font-family="ui-sans-serif, system-ui" font-weight="900" fill="url(#a)">AMEX</text>
        </svg>
      `;
    case "discover":
      return `
        <svg ${common} aria-label="Discover">
          <rect x="0.5" y="0.5" width="85" height="27" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)"/>
          <path d="M48 6 C58 10, 58 18, 48 22" fill="none" stroke="#f59e0b" stroke-width="3.2" opacity="0.95"/>
          <text x="10" y="18" font-size="10.5" font-family="ui-sans-serif, system-ui" font-weight="800" fill="rgba(229,231,235,0.9)">DISC</text>
        </svg>
      `;
    case "diners":
      return `
        <svg ${common} aria-label="Diners Club">
          <rect x="0.5" y="0.5" width="85" height="27" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)"/>
          <circle cx="42" cy="14" r="8" fill="rgba(96,165,250,0.22)" stroke="rgba(96,165,250,0.75)" stroke-width="1.5"/>
          <text x="10" y="18" font-size="10.5" font-family="ui-sans-serif, system-ui" font-weight="800" fill="rgba(229,231,235,0.9)">DINERS</text>
        </svg>
      `;
    case "jcb":
      return `
        <svg ${common} aria-label="JCB">
          <rect x="0.5" y="0.5" width="85" height="27" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)"/>
          <text x="12" y="19" font-size="13" font-family="ui-sans-serif, system-ui" font-weight="900" fill="rgba(167,139,250,0.95)">JCB</text>
        </svg>
      `;
    case "enroute":
      return `
        <svg ${common} aria-label="EnRoute">
          <rect x="0.5" y="0.5" width="85" height="27" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)"/>
          <text x="10" y="18" font-size="10.5" font-family="ui-sans-serif, system-ui" font-weight="800" fill="rgba(229,231,235,0.9)">ENROUTE</text>
        </svg>
      `;
    case "voyager":
      return `
        <svg ${common} aria-label="Voyager">
          <rect x="0.5" y="0.5" width="85" height="27" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)"/>
          <text x="10" y="18" font-size="10.5" font-family="ui-sans-serif, system-ui" font-weight="800" fill="rgba(229,231,235,0.9)">VOYAGER</text>
        </svg>
      `;
    case "hipercard":
      return `
        <svg ${common} aria-label="HiperCard">
          <rect x="0.5" y="0.5" width="85" height="27" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)"/>
          <text x="10" y="18" font-size="10.5" font-family="ui-sans-serif, system-ui" font-weight="900" fill="rgba(239,68,68,0.95)">HIPER</text>
        </svg>
      `;
    case "aura":
      return `
        <svg ${common} aria-label="Aura">
          <rect x="0.5" y="0.5" width="85" height="27" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)"/>
          <text x="12" y="19" font-size="13" font-family="ui-sans-serif, system-ui" font-weight="900" fill="rgba(245,158,11,0.95)">AURA</text>
        </svg>
      `;
    default:
      return `
        <svg ${common} aria-label="Desconhecida">
          <rect x="0.5" y="0.5" width="85" height="27" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)"/>
          <text x="10" y="18" font-size="10.5" font-family="ui-sans-serif, system-ui" font-weight="700" fill="rgba(229,231,235,0.65)">—</text>
        </svg>
      `;
  }
}

function setStatus(dotEl, statusEl, badgeEl, mode, text, badgeText) {
  // mode: idle | ok | warn | bad
  const dotStyles = {
    idle: { bg: "rgba(148,163,184,0.7)", ring: "rgba(148,163,184,0.14)" },
    ok: { bg: "rgba(34,197,94,1)", ring: "rgba(34,197,94,0.16)" },
    warn: { bg: "rgba(245,158,11,1)", ring: "rgba(245,158,11,0.16)" },
    bad: { bg: "rgba(239,68,68,1)", ring: "rgba(239,68,68,0.16)" },
  };

  const badgeClassMap = { idle: "", ok: "badge--ok", warn: "badge--warn", bad: "badge--bad" };

  const s = dotStyles[mode] || dotStyles.idle;
  dotEl.style.background = s.bg;
  dotEl.style.boxShadow = `0 0 0 4px ${s.ring}`;

  statusEl.textContent = text;

  badgeEl.classList.remove("badge--ok", "badge--warn", "badge--bad");
  const cls = badgeClassMap[mode];
  if (cls) badgeEl.classList.add(cls);
  badgeEl.textContent = badgeText || "—";
}

function setupCardTilt(cardEl) {
  let flip = false;
  const innerEl = cardEl.querySelector(".card3dInner") || cardEl;

  function onMove(e) {
    const rect = cardEl.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1

    const ry = (px - 0.5) * 10; // deg
    const rx = (0.5 - py) * 8; // deg

    innerEl.style.setProperty("--ry", `${flip ? -ry : ry}deg`);
    innerEl.style.setProperty("--rx", `${flip ? -rx : rx}deg`);

    innerEl.style.setProperty("--sx", `${Math.round(px * 100)}%`);
    innerEl.style.setProperty("--sy", `${Math.round(py * 100)}%`);
  }

  function onLeave() {
    innerEl.style.setProperty("--ry", `0deg`);
    innerEl.style.setProperty("--rx", `0deg`);
    innerEl.style.setProperty("--sx", `20%`);
    innerEl.style.setProperty("--sy", `20%`);
  }

  cardEl.addEventListener("mousemove", onMove);
  cardEl.addEventListener("mouseleave", onLeave);
  cardEl.addEventListener("click", () => {
    flip = !flip;
    cardEl.classList.toggle("is-flipped", flip);
    // pequeno “snap” visual ao clicar
    innerEl.style.transition = "transform 120ms ease";
    setTimeout(() => (innerEl.style.transition = "transform 220ms ease"), 140);
  });
}

function setup() {
  const input = document.getElementById("cardNumber");
  const btnClear = document.getElementById("btnClear");
  const btnCopy = document.getElementById("btnCopy");

  const digitsCount = document.getElementById("digitsCount");
  const lengthEl = document.getElementById("length");
  const brandText = document.getElementById("brandText");
  const brandBadge = document.getElementById("brandBadge");
  const brandLogo = document.getElementById("brandLogo");
  const brandLogoBack = document.getElementById("brandLogoBack");

  const statusDot = document.getElementById("statusDot");
  const statusEl = document.getElementById("status");
  const luhnEl = document.getElementById("luhn");

  const previewNumber = document.getElementById("cardNumberPreview");
  const card3d = document.getElementById("card3d");

  setupCardTilt(card3d);

  function render(rawValue, shouldFormatInput = true) {
    const digits = onlyDigits(rawValue);
    const result = detectBrand(digits);

    digitsCount.textContent = String(digits.length);
    lengthEl.textContent = String(digits.length);

    // Preview number
    previewNumber.textContent = digits ? formatGroups(digits).padEnd(19, "•") : "•••• •••• •••• ••••";

    // Brand
    brandText.textContent = result ? result.brand : digits ? "Desconhecida" : "—";
    brandBadge.textContent = result ? result.brand : digits ? "Desconhecida" : "—";
    brandLogo.innerHTML = logoSVG(result ? result.code : null);
    if (brandLogoBack) brandLogoBack.innerHTML = logoSVG(result ? result.code : null);

    // Luhn
    if (!digits) {
      luhnEl.textContent = "—";
    } else if (digits.length < 12) {
      luhnEl.textContent = "curto";
    } else {
      luhnEl.textContent = luhnCheck(digits) ? "ok" : "falhou";
    }

    // Status logic
    if (!digits) {
      setStatus(statusDot, statusEl, brandBadge, "idle", "Aguardando…", "—");
    } else if (!result) {
      setStatus(statusDot, statusEl, brandBadge, "bad", "Bandeira não reconhecida", "Desconhecida");
    } else {
      const luhnOk = digits.length >= 12 ? luhnCheck(digits) : true;
      if (!luhnOk) {
        setStatus(
          statusDot,
          statusEl,
          brandBadge,
          "warn",
          "Bandeira reconhecida, mas falhou no Luhn",
          result.brand
        );
      } else {
        setStatus(statusDot, statusEl, brandBadge, "ok", "Bandeira reconhecida", result.brand);
      }
    }

    // Format input
    if (shouldFormatInput) {
      const formatted = formatGroups(digits);
      if (input.value !== formatted) input.value = formatted;
    }
  }

  input.addEventListener("input", (e) => render(e.target.value, true));

  btnClear.addEventListener("click", () => {
    input.value = "";
    input.focus();
    render("", false);
  });

  btnCopy.addEventListener("click", async () => {
    const digits = onlyDigits(input.value);
    if (!digits) return;

    try {
      await navigator.clipboard.writeText(digits);
      const old = btnCopy.textContent;
      btnCopy.textContent = "Copiado!";
      setTimeout(() => (btnCopy.textContent = old), 900);
    } catch {
      // fallback simples
      input.select();
      document.execCommand("copy");
    }
  });

  render("", false);
}

document.addEventListener("DOMContentLoaded", setup);