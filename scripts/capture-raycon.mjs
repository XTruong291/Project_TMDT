import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const shotsDir = path.join(root, "docs", "design-references", "raycon");
const researchDir = path.join(root, "docs", "research", "raycon");
const publicDir = path.join(root, "public", "sites", "raycon");

fs.mkdirSync(shotsDir, { recursive: true });
fs.mkdirSync(researchDir, { recursive: true });
fs.mkdirSync(path.join(publicDir, "images"), { recursive: true });
fs.mkdirSync(path.join(publicDir, "icons"), { recursive: true });
fs.mkdirSync(path.join(publicDir, "fonts"), { recursive: true });

function hideOverlaysScript() {
  const selectors = [
    '[id*="klaviyo"]',
    '[class*="klaviyo"]',
    '[id*="Klaviyo"]',
    '[class*="Klaviyo"]',
    'iframe[src*="klaviyo"]',
    '[class*="needsclick"]',
    '[id*="attentive"]',
    '[class*="attentive"]',
    '[id*="wheel"]',
    '[class*="wheel"]',
    '[class*="spin-to-win"]',
    '[id*="spin"]',
    '[class*="fortune"]',
    '[id*="onetrust"]',
    '[class*="onetrust"]',
    "#onetrust-banner-sdk",
    ".ot-sdk-container",
    '[id*="cookie"]',
    '[class*="cookie-banner"]',
    '[class*="CookieBanner"]',
    '[id*="CybotCookiebot"]',
    '[id*="intercom"]',
    '[class*="intercom"]',
    'iframe[name*="intercom"]',
    '[id*="gorgias"]',
    '[class*="gorgias"]',
    "#gorgias-chat-container",
    '[id*="tidio"]',
    '[id*="crisp"]',
    '[class*="shopify-chat"]',
    "#ShopifyChat",
    '[id*="smile-ui"]',
    ".needsclick",
    '[aria-label*="cookie" i]',
    '[aria-label*="chat" i]',
    '[class*="popup"]',
    '[id*="popup"]',
    ".modal-backdrop",
    '[class*="overlay"]',
  ];

  const hide = () => {
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach((el) => {
        if (!(el instanceof HTMLElement)) return;
        el.style.setProperty("display", "none", "important");
        el.style.setProperty("visibility", "hidden", "important");
        el.style.setProperty("pointer-events", "none", "important");
        el.style.setProperty("opacity", "0", "important");
      });
    }
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
  };

  hide();
  const obs = new MutationObserver(hide);
  obs.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(() => obs.disconnect(), 15000);
}

async function downloadFile(url, dest) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    });
    if (!res.ok) return { ok: false, url, status: res.status };
    const buf = Buffer.from(await res.arrayBuffer());
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, buf);
    return { ok: true, url, dest, type: res.headers.get("content-type"), bytes: buf.length };
  } catch (err) {
    return { ok: false, url, error: String(err) };
  }
}

function safeName(input, fallback) {
  const cleaned = input
    .replace(/[?#].*$/, "")
    .split("/")
    .pop()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
  return cleaned || fallback;
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
});
const page = await context.newPage();
await page.addInitScript(hideOverlaysScript);

await page.goto("https://rayconglobal.com/", { waitUntil: "domcontentloaded", timeout: 90000 });
await page.waitForTimeout(4000);
await page.evaluate(hideOverlaysScript);
await page.waitForTimeout(1500);

const extraction = await page.evaluate(() => {
  const rgbToOklch = (r, g, b) => {
    const srgb = [r, g, b].map((v) => {
      const c = v / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    const [R, G, B] = srgb;
    const l = 0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B;
    const m = 0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B;
    const s = 0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B;
    const l_ = Math.cbrt(l);
    const m_ = Math.cbrt(m);
    const s_ = Math.cbrt(s);
    const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
    const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
    const b2 = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
    const C = Math.sqrt(a * a + b2 * b2);
    const h = (Math.atan2(b2, a) * 180) / Math.PI;
    return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${(h < 0 ? h + 360 : h).toFixed(1)})`;
  };

  const parseColor = (css) => {
    const m = css.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) return { css, oklch: null };
    const r = Number(m[1]);
    const g = Number(m[2]);
    const b = Number(m[3]);
    return { css, hex: `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`, oklch: rgbToOklch(r, g, b) };
  };

  const cssVars = {};
  const styles = [...document.styleSheets];
  for (const sheet of styles) {
    let rules;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }
    for (const rule of rules) {
      if (!(rule instanceof CSSStyleRule)) continue;
      if (!rule.selectorText.includes(":root") && !rule.selectorText.includes("html")) continue;
      for (const name of rule.style) {
        if (name.startsWith("--")) cssVars[name] = rule.style.getPropertyValue(name).trim();
      }
    }
  }

  const headings = [...document.querySelectorAll("h1,h2,h3,p,a,button,nav")].slice(0, 40).map((el) => {
    const cs = getComputedStyle(el);
    return {
      tag: el.tagName,
      text: (el.textContent || "").trim().slice(0, 80),
      font: cs.fontFamily,
      size: cs.fontSize,
      weight: cs.fontWeight,
      lineHeight: cs.lineHeight,
      letterSpacing: cs.letterSpacing,
      color: parseColor(cs.color),
      bg: parseColor(cs.backgroundColor),
    };
  });

  const navLinks = [...document.querySelectorAll("header a, nav a")].map((a) => ({
    text: (a.textContent || "").trim(),
    href: a.href,
  }));

  const footerLinks = [...document.querySelectorAll("footer a")].map((a) => ({
    text: (a.textContent || "").trim(),
    href: a.href,
  }));

  const images = [...document.querySelectorAll("img")].map((img) => ({
    alt: img.alt,
    src: img.currentSrc || img.src,
    width: img.naturalWidth,
    height: img.naturalHeight,
  }));

  const bgImages = [];
  document.querySelectorAll("*").forEach((el) => {
    const bg = getComputedStyle(el).backgroundImage;
    if (bg && bg !== "none" && bg.includes("url(")) {
      const urls = [...bg.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map((m) => m[1]);
      urls.forEach((u) => bgImages.push({ url: u, tag: el.tagName, className: el.className?.toString?.().slice(0, 80) }));
    }
  });

  const svgs = [...document.querySelectorAll("svg")].slice(0, 80).map((svg, i) => ({
    i,
    viewBox: svg.getAttribute("viewBox"),
    aria: svg.getAttribute("aria-label"),
    className: svg.getAttribute("class"),
    html: svg.outerHTML.slice(0, 2000),
  }));

  const fonts = [...document.fonts].map((f) => ({
    family: f.family,
    weight: f.weight,
    style: f.style,
    status: f.status,
  }));

  const fontFaces = [];
  for (const sheet of document.styleSheets) {
    let rules;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }
    for (const rule of rules) {
      if (rule instanceof CSSFontFaceRule) {
        fontFaces.push({
          family: rule.style.getPropertyValue("font-family"),
          weight: rule.style.getPropertyValue("font-weight"),
          src: rule.style.getPropertyValue("src"),
          style: rule.style.getPropertyValue("font-style"),
        });
      }
    }
  }

  const products = [];
  const cards = document.querySelectorAll(
    '[class*="product-card"], [class*="product_card"], [class*="ProductCard"], [data-product], .product-item, [class*="card"]',
  );
  cards.forEach((card) => {
    const title = card.querySelector("h2,h3,h4,.product-title,[class*='title']");
    const price = card.querySelector("[class*='price'], .price, [data-price]");
    const img = card.querySelector("img");
    const review = (card.textContent || "").match(/[\d,]+\s*(reviews?|ratings?)/i);
    const badge = card.querySelector("[class*='badge'], [class*='tag'], [class*='label']");
    if (title || price) {
      products.push({
        title: title?.textContent?.trim(),
        price: price?.textContent?.trim(),
        review: review?.[0],
        badge: badge?.textContent?.trim(),
        image: img?.currentSrc || img?.src,
        htmlSnippet: card.textContent?.replace(/\s+/g, " ").trim().slice(0, 300),
      });
    }
  });

  const sections = [...document.querySelectorAll("main section, main > div, header, footer, [class*='section']")]
    .slice(0, 40)
    .map((el) => ({
      tag: el.tagName,
      id: el.id,
      className: el.className?.toString?.().slice(0, 120),
      text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 180),
      h: el.getBoundingClientRect().height,
    }));

  const body = getComputedStyle(document.body);
  const html = getComputedStyle(document.documentElement);

  return {
    title: document.title,
    cssVars,
    bodyFont: body.fontFamily,
    htmlBg: parseColor(html.backgroundColor),
    bodyBg: parseColor(body.backgroundColor),
    bodyColor: parseColor(body.color),
    headings,
    navLinks,
    footerLinks,
    images,
    bgImages,
    svgs,
    fonts,
    fontFaces,
    products,
    sections,
    announcement: document.querySelector("[class*='announcement'], [class*='promo-bar'], [class*='top-bar']")?.textContent?.replace(/\s+/g, " ").trim(),
    headerHtml: document.querySelector("header")?.innerText?.slice(0, 1500),
    footerHtml: document.querySelector("footer")?.innerText?.slice(0, 2500),
    h1: document.querySelector("h1")?.textContent?.trim(),
    allH2: [...document.querySelectorAll("h2")].map((h) => h.textContent?.trim()),
  };
});

fs.writeFileSync(path.join(researchDir, "extraction.json"), JSON.stringify(extraction, null, 2));

await page.screenshot({ path: path.join(shotsDir, "desktop-1440x900-top.png"), fullPage: false });
await page.screenshot({ path: path.join(shotsDir, "desktop-1440x900-full.png"), fullPage: true });

const heights = await page.evaluate(() => document.body.scrollHeight);
for (const y of [0, 700, 1400, 2100, 2800, 3500, 4200, 5000]) {
  if (y > heights) break;
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(600);
  await page.evaluate(hideOverlaysScript);
  await page.screenshot({ path: path.join(shotsDir, `desktop-1440x900-y${y}.png`), fullPage: false });
}

await page.setViewportSize({ width: 390, height: 844 });
await page.evaluate(hideOverlaysScript);
await page.waitForTimeout(800);
await page.screenshot({ path: path.join(shotsDir, "mobile-390x844-top.png"), fullPage: false });
await page.screenshot({ path: path.join(shotsDir, "mobile-390x844-full.png"), fullPage: true });

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto("https://rayconglobal.com/", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);
await page.evaluate(hideOverlaysScript);

const hrefs = [...new Set((extraction.images || []).map((i) => i.src).filter(Boolean))];
const bgHrefs = [...new Set((extraction.bgImages || []).map((i) => i.url).filter(Boolean))];
const allUrls = [...new Set([...hrefs, ...bgHrefs])];

const downloads = [];
let i = 0;
for (const url of allUrls) {
  if (!url.startsWith("http")) continue;
  if (url.includes("pixel") || url.includes("analytics") || url.includes("facebook") || url.includes("doubleclick")) continue;
  i += 1;
  const extGuess = url.includes(".svg") ? ".svg" : path.extname(new URL(url).pathname) || ".jpg";
  const name = safeName(url, `asset-${i}${extGuess}`);
  const dest = path.join(publicDir, "images", name.endsWith(extGuess) ? name : name + extGuess);
  const result = await downloadFile(url, dest);
  downloads.push({ ...result, local: `/sites/raycon/images/${path.basename(dest)}` });
}

fs.writeFileSync(path.join(researchDir, "asset-map.json"), JSON.stringify(downloads, null, 2));

await browser.close();
console.log(JSON.stringify({
  title: extraction.title,
  h1: extraction.h1,
  h2: extraction.allH2,
  nav: extraction.navLinks?.slice(0, 20),
  announcement: extraction.announcement,
  productCount: extraction.products?.length,
  imageCount: extraction.images?.length,
  fontFaces: extraction.fontFaces?.slice(0, 15),
  cssVarsSample: Object.fromEntries(Object.entries(extraction.cssVars || {}).slice(0, 40)),
  downloads: downloads.filter((d) => d.ok).length,
}, null, 2));
