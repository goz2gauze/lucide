import {
  ACCENTS,
  ASSISTANT_REPLIES,
  BACKGROUNDS,
  DISGUISES,
  GAMES,
  MODELS,
  ONLINE_COUNT,
  SEARCH_ENGINES,
  SUGGESTIONS,
  THEMES,
} from "./data.js";
import { config } from "./config.js";
import { decodeProxyUrl, ensureProxy, proxy, proxyUrl } from "./proxy.js";
import { setFontObfuscation } from "./obfuscate.js";

const demo = (name) => config.demos[name] === true;

/* ------------------------------------------------------------------ credit guard */
/* The credit pill is required for this build to run. Removing it or editing
 * its text or href replaces the whole app with an integrity error. */
const CREDIT_TEXT = "recreated by goz!";
const CREDIT_HREF = /^https:\/\/discord\.(gg|com)\//i;
let creditBroken = false;
let creditObserver = null;

function creditIntact() {
  const link = document.querySelector("#siteCredit a[data-credit]");
  if (!link) return false;
  if (link.textContent.replace(/\s+/g, " ").trim().toLowerCase() !== CREDIT_TEXT) return false;
  return CREDIT_HREF.test(link.href);
}

function breakSite() {
  if (creditBroken) return;
  creditBroken = true;
  creditObserver?.disconnect();
  document.title = "Lucide — integrity error";
  document.body.className = "credit-broken";
  document.body.innerHTML = `
    <div class="credit-error">
      <h1>Integrity check failed</h1>
      <p>The credit pill was removed or changed, so this build will not run.</p>
      <p>Restore <code>recreated by goz!</code> in <code>index.html</code> to bring the site back.</p>
      <code>ERR_CREDIT_MISSING</code>
    </div>`;
}

function startCreditGuard() {
  const link = document.querySelector("#siteCredit a[data-credit]");
  if (link) link.href = config.creditUrl;
  if (!creditIntact()) {
    breakSite();
    return;
  }
  creditObserver = new MutationObserver(() => {
    if (!creditIntact()) breakSite();
  });
  creditObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["href"],
  });
}

startCreditGuard();
if (creditBroken) throw new Error("Lucide: credit pill missing, refusing to start.");

/* ------------------------------------------------------------------ icons */
const ICONS = {
  back: '<path d="m15 18-6-6 6-6"/>',
  forward: '<path d="m9 18 6-6-6-6"/>',
  reload: '<path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/>',
  panel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  sparkle: '<path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4"/>',
  ai: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/><circle cx="12" cy="12" r="3"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5Z"/><path d="M4 19V5.5"/>',
  roblox: '<path d="m5 3 16 4-4 16L1 19Z"/><path d="m9 10 6 1.5-1.5 6-6-1.5Z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.4 4 5.6 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.6-4-9s1.4-6.6 4-9Z"/>',
  paperclip: '<path d="m21 11.5-8.5 8.5a5 5 0 0 1-7-7L14 4.5a3.5 3.5 0 0 1 5 5L10.5 18a2 2 0 0 1-3-3L15 7.5"/>',
  send: '<path d="M12 19V5M5 12l7-7 7 7"/>',
  star: '<path d="m12 3 2.7 5.7 6.3.9-4.5 4.4 1 6.2-5.5-3-5.5 3 1-6.2L3 9.6l6.3-.9Z"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  screen: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  message: '<path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.6 8.6 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5Z"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
};

function icon(name, cls = "") {
  return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ""}</svg>`;
}

/* ------------------------------------------------------------------ storage */
const STORE_KEY = "lucide.recreation.v1";

const defaultState = () => ({
  settings: {
    searchEngineId: "duckduckgo",
    customSearchUrl: "",
    searchSuggestions: true,
    restoreTabs: true,
    reduceMotion: false,
    backgroundMode: "darkveil",
    theme: "dark",
    accent: "#ffffff",
    adblock: true,
    apiHost: "auto",
    apiCustom: "",
    tabDisguise: "none",
    tabTitle: "",
    faviconUrl: "",
    exitKey: "`",
    exitUrl: "https://docs.google.com/document/u/0/",
    confirmLeave: false,
    autoCover: false,
  },
  bookmarks: [
    { id: "tiktok", url: "https://www.tiktok.com/", label: "TikTok" },
    { id: "discord", url: "https://discord.com/", label: "Discord" },
  ],
  tabs: [{ id: "tab-home", route: "home" }],
  activeTab: "tab-home",
  user: null,
  sidebarCompact: false,
  sidebarAuto: false,
  adsSeen: false,
  plusDismissed: false,
  usage: { count: 0, day: new Date().toDateString() },
  threads: [],
  activeThread: null,
});

let state = loadState();

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
    if (!saved) return defaultState();
    const base = defaultState();
    return {
      ...base,
      ...saved,
      settings: { ...base.settings, ...(saved.settings || {}) },
      usage: { ...base.usage, ...(saved.usage || {}) },
      tabs: Array.isArray(saved.tabs) && saved.tabs.length ? saved.tabs : base.tabs,
    };
  } catch {
    return defaultState();
  }
}
function saveState() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    /* storage can be unavailable */
  }
}
function resetUsageDay() {
  const today = new Date().toDateString();
  if (state.usage.day !== today) state.usage = { count: 0, day: today };
}

/* ------------------------------------------------------------------ routing */
const ROUTES = {
  home: { path: "/", label: "New Tab", tabTitle: "New Tab" },
  ai: { path: "/a", label: "AI", tabTitle: "AI" },
  games: { path: "/g", label: "Education", tabTitle: "Education" },
  roblox: { path: "/roblox", label: "Roblox", tabTitle: "Roblox" },
  account: { path: "/u", label: "Account", tabTitle: "Account" },
  plus: { path: "/p", label: "Lucide Plus", tabTitle: "Lucide Plus" },
  web: { path: "/web", label: "Web", tabTitle: "Web" },
  settings: { path: "/s", label: "Settings", tabTitle: "Settings" },
};
const NAV = ["ai", "games", "roblox", "account", "settings"];
const NAV_ICONS = { ai: "ai", games: "book", roblox: "roblox", account: "user", settings: "settings" };

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const activeTab = () => state.tabs.find((t) => t.id === state.activeTab) || state.tabs[0];
const activeRoute = () => activeTab()?.route || "home";

function pathFor(route) {
  return `#${ROUTES[route]?.path || "/"}`;
}

function pathForTab(tab) {
  if (tab?.route === "web" && tab.url) return `#/web?url=${encodeURIComponent(tab.url)}`;
  return pathFor(tab?.route || "home");
}

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "") || "Web";
  } catch {
    return "Web";
  }
}

function setActiveTab(id) {
  state.activeTab = id;
  saveState();
  const route = activeRoute();
  if (route === "ai" && !state.sidebarAuto) {
    state.sidebarCompact = true;
    state.sidebarAuto = true;
  } else if (route !== "ai" && state.sidebarAuto) {
    state.sidebarCompact = false;
    state.sidebarAuto = false;
  }
  history.replaceState(null, "", pathForTab(activeTab()));
  render();
}

function openRoute(route) {
  if (!ROUTES[route]) route = "home";
  let tab = activeTab();
  if (!tab) {
    tab = { id: `tab-${Date.now().toString(36)}`, route };
    state.tabs.push(tab);
  } else {
    tab.route = route;
    tab.url = "";
    tab.title = "";
  }
  state.activeTab = tab.id;
  if (route === "ai" && !state.sidebarAuto) {
    state.sidebarCompact = true;
    state.sidebarAuto = true;
  } else if (route !== "ai" && state.sidebarAuto) {
    state.sidebarCompact = false;
    state.sidebarAuto = false;
  }
  saveState();
  history.replaceState(null, "", pathForTab(tab));
  render();
}

function addTab() {
  const tab = { id: `tab-${Date.now().toString(36)}`, route: "home" };
  state.tabs.push(tab);
  setActiveTab(tab.id);
}

function closeTab(id) {
  if (state.tabs.length <= 1) return;
  const index = state.tabs.findIndex((tab) => tab.id === id);
  state.tabs = state.tabs.filter((tab) => tab.id !== id);
  if (state.activeTab === id) state.activeTab = state.tabs[Math.max(0, index - 1)].id;
  saveState();
  render();
}

/* ------------------------------------------------------------------ appearance */
function applySettings() {
  const s = state.settings;
  const theme = THEMES[s.theme] || THEMES.dark;
  document.documentElement.dataset.theme = s.theme === "light" ? "light" : "dark";
  document.documentElement.dataset.skin = s.theme === "halloween" ? "halloween" : "dark";
  document.documentElement.style.setProperty("--accent", s.accent || theme.accent);
  document.documentElement.style.setProperty(
    "--accent-contrast",
    s.theme === "light" ? "#ffffff" : theme.accent === "#ff7a1a" ? "#1a0900" : "#000000",
  );
  document.body.dataset.bg = s.backgroundMode;
  document.body.dataset.skin = s.theme === "halloween" ? "halloween" : "dark";
  document.body.classList.toggle("reduce-motion", !!s.reduceMotion);
  applyDisguise();
}

function applyDisguise() {
  const s = state.settings;
  const preset = DISGUISES[s.tabDisguise] || DISGUISES.none;
  const title = s.tabDisguise === "custom" ? s.tabTitle || "Home" : preset.title || "Home";
  document.title = title;
  let link = $('link[rel="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  const fav = s.tabDisguise === "custom" ? s.faviconUrl : preset.favicon;
  link.href = fav || "./assets/mark.svg";
}

/* ------------------------------------------------------------------ helpers */
const esc = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

function engineFor(id) {
  return SEARCH_ENGINES[id] || SEARCH_ENGINES.duckduckgo;
}

let wispNoticeShown = false;

function runSearch(raw) {
  const value = String(raw || "").trim();
  if (!value) return;
  const looksLikeUrl = /^https?:\/\//i.test(value) || (/^[\w-]+(\.[\w-]+)+([/?#].*)?$/.test(value) && !/\s/.test(value));
  let target;
  if (looksLikeUrl) {
    target = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  } else {
    const engine = engineFor(state.settings.searchEngineId);
    const base = state.settings.searchEngineId === "custom" ? state.settings.customSearchUrl : engine.url;
    if (!base) {
      toast("Add a custom search URL in Settings first.");
      return;
    }
    target = base + encodeURIComponent(value);
  }
  openTarget(target);
}

async function openTarget(target) {
  if (!config.wisp || config.proxyEnabled === false) {
    if (!wispNoticeShown) {
      wispNoticeShown = true;
      toast("Wisp is not configured in config.js; opening in a new tab.");
    }
    window.open(target, "_blank", "noopener,noreferrer");
    return;
  }

  if (proxy.state === "idle") toast("Starting the in-app proxy…");
  const result = await ensureProxy();
  if (result.state === "ready") {
    openWebTab(target);
    return;
  }
  toast(`Proxy unavailable: ${result.error}.`);
  window.open(target, "_blank", "noopener,noreferrer");
}

function openWebTab(url) {
  let tab = activeTab();
  if (tab && (tab.route === "home" || tab.route === "web")) {
    tab.route = "web";
    tab.url = url;
    tab.title = hostOf(url);
  } else {
    tab = { id: `tab-${Date.now().toString(36)}`, route: "web", url, title: hostOf(url) };
    state.tabs.push(tab);
  }
  state.activeTab = tab.id;
  if (state.sidebarAuto) {
    state.sidebarCompact = false;
    state.sidebarAuto = false;
  }
  saveState();
  history.replaceState(null, "", pathForTab(tab));
  render();
}

function toast(message) {
  const stack = $("#toastStack");
  if (!stack) return;
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  stack.appendChild(node);
  setTimeout(() => node.remove(), 3200);
}

/* ------------------------------------------------------------------ modal */
let modalCleanup = null;
function openModal(html) {
  const root = $("#modalRoot");
  root.hidden = false;
  root.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
  root.onclick = (event) => {
    if (event.target === root) closeModal();
  };
  document.addEventListener("keydown", modalKeys);
}
function closeModal() {
  const root = $("#modalRoot");
  if (!root || root.hidden) return;
  root.hidden = true;
  root.innerHTML = "";
  root.onclick = null;
  document.removeEventListener("keydown", modalKeys);
  if (modalCleanup) modalCleanup();
  modalCleanup = null;
}
function modalKeys(event) {
  if (event.key === "Escape") closeModal();
}

function showAdsNotice() {
  openModal(`
    <h2>A quick note about ads</h2>
    <p>Ads help keep Lucide free to run. You may see a few while using the site.</p>
    <p>Ignore any ad that asks you to download something, install an extension, or enable notifications — those are not from us.</p>
    <p>Prefer no ads? <button class="text-link" data-action="go-plus">Upgrade to Plus</button></p>
    <div class="modal-actions"><button class="btn btn-primary" data-action="dismiss-ads">Okay</button></div>
  `);
  state.adsSeen = true;
  saveState();
}

/* ------------------------------------------------------------------ shell */
function render() {
  $("#app")?.classList.toggle("compact", state.sidebarCompact);
  renderBookmarks();
  renderTabs();
  renderNav();
  renderPage();
  renderPlusToast();
  syncTopbar();
  applySettings();
}

function syncTopbar() {
  const tab = activeTab();
  const input = $("#topSearchInput");
  if (input) input.value = tab?.route === "web" ? tab.url || "" : "";
  const reload = $("#reloadBtn");
  if (reload) reload.disabled = tab?.route !== "web";
}

function renderBookmarks() {
  const wrap = $("#bookmarks");
  if (!wrap) return;
  wrap.innerHTML =
    state.bookmarks
      .map((bookmark) => {
        const special = bookmark.id === "tiktok" || bookmark.id === "discord";
        const host = (() => {
          try {
            return new URL(bookmark.url).hostname;
          } catch {
            return "";
          }
        })();
        const art = special
          ? `<span class="bm-art ${bookmark.id}">${bookmark.id === "tiktok" ? tiktokArt() : discordArt()}</span>`
          : `<img src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64" alt="" onerror="this.replaceWith(document.createTextNode('${esc((bookmark.label || "?").slice(0, 1))}'))" />`;
        return `<a class="bookmark" href="${esc(bookmark.url)}" target="_blank" rel="noopener noreferrer" title="${esc(bookmark.label)}">
          ${art}
          <button class="bookmark-remove" data-action="remove-bookmark" data-id="${esc(bookmark.id)}" aria-label="Remove bookmark">×</button>
        </a>`;
      })
      .join("") +
    `<button class="bookmark bookmark-add" data-action="add-bookmark" type="button" aria-label="Add bookmark">${icon("plus")}</button>`;
}

function tiktokArt() {
  return `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" stroke="none" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`;
}
function discordArt() {
  return `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" stroke="none" d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>`;
}

function renderTabs() {
  const list = $("#tabList");
  if (!list) return;
  list.innerHTML = state.tabs
    .map((tab) => {
      const route = ROUTES[tab.route] || ROUTES.home;
      const active = tab.id === state.activeTab;
      const isWeb = tab.route === "web";
      const label = isWeb ? tab.title || hostOf(tab.url) : "New Tab";
      return `<div class="tab-item${active ? " active" : ""}" role="listitem" data-action="select-tab" data-id="${tab.id}" tabindex="0">
        <span class="tab-icon">${icon(isWeb ? "globe" : "sparkle")}</span>
        <span class="tab-title">${esc(label)}</span>
        ${state.tabs.length > 1 ? `<button class="tab-close" data-action="close-tab" data-id="${tab.id}" aria-label="Close tab">${icon("close")}</button>` : ""}
      </div>`;
    })
    .join("");
}

function renderNav() {
  const nav = $("#nav");
  if (!nav) return;
  const current = activeRoute();
  nav.innerHTML = NAV.map(
    (key) => `<button class="nav-item${current === key ? " active" : ""}" data-action="open-route" data-route="${key}" type="button" aria-label="${ROUTES[key].label}" title="${ROUTES[key].label}">
      ${icon(NAV_ICONS[key])}<span>${ROUTES[key].label}</span>
    </button>`,
  ).join("");
}

function renderPlusToast() {
  const toastEl = $("#plusToast");
  if (!toastEl) return;
  const hidden = state.plusDismissed || activeRoute() === "plus";
  toastEl.hidden = hidden;
}

/* ------------------------------------------------------------------ pages */
function renderPage() {
  const page = $("#page");
  if (!page) return;
  const route = activeRoute();
  if (route === "web") page.innerHTML = renderWeb(activeTab());
  else if (route === "ai") {
    page.innerHTML = demo("ai")
      ? renderAI()
      : renderUnavailable(
          "Lucide AI",
          "Lucide AI isn't available at the moment.",
          "The original site's AI backend isn't part of this recreation.",
        );
  } else if (route === "games") {
    page.innerHTML = demo("games")
      ? renderGames()
      : renderUnavailable(
          "Education",
          "Games aren't available at the moment.",
          "The game catalog and files lived behind the original site's backend.",
        );
  } else if (route === "roblox") {
    page.innerHTML = demo("roblox")
      ? renderRoblox()
      : renderUnavailable(
          "LucideBlox",
          "LucideBlox isn't available at the moment.",
          "The original launches a separate Roblox client that isn't included.",
        );
  } else if (route === "account") {
    page.innerHTML = demo("account")
      ? renderAccount()
      : renderUnavailable(
          "Lucide Account",
          "Accounts aren't available at the moment.",
          "Sign-in needs the original account backend, which isn't included.",
        );
  } else if (route === "plus") page.innerHTML = renderPlus();
  else if (route === "settings") page.innerHTML = renderSettings();
  else page.innerHTML = renderHome();
  wirePage(route);
  page.scrollTop = 0;
}

function renderWeb(tab) {
  const url = tab?.url || "";
  const src = proxyUrl(url);
  if (!src) {
    const message =
      proxy.state === "error"
        ? `The proxy is not available${proxy.error ? `: ${proxy.error}` : ""}.`
        : "Preparing the in-app proxy…";
    return `<section class="web-page">
      <div class="web-loading">
        ${proxy.state === "error" ? "" : '<span class="web-spinner" aria-hidden="true"></span>'}
        <p class="web-status">${esc(message)}</p>
      </div>
    </section>`;
  }
  return `<section class="web-page">
    <div class="web-loading" id="webLoading">
      <span class="web-spinner" aria-hidden="true"></span>
      <p class="web-status">Loading ${esc(hostOf(url))}…</p>
    </div>
    <iframe id="webFrame" title="${esc(hostOf(url))}" src="${esc(src)}" referrerpolicy="no-referrer"></iframe>
  </section>`;
}

function wireWebTab() {
  const frame = $("#webFrame");
  if (!frame) {
    if (proxy.state !== "error") ensureProxy().then(() => renderPage());
    return;
  }
  const loading = $("#webLoading");
  const slow = setTimeout(() => {
    const status = $("#webLoading .web-status");
    if (status) status.textContent = `Still loading ${hostOf(activeTab()?.url)}…`;
  }, 12000);
  frame.addEventListener("load", () => {
    clearTimeout(slow);
    loading?.setAttribute("hidden", "");
    try {
      const path = frame.contentWindow?.location?.pathname || "";
      if (path.startsWith(proxy.prefix)) {
        const real = decodeProxyUrl(path.slice(proxy.prefix.length));
        const tab = activeTab();
        if (real && tab?.route === "web") {
          tab.url = real;
          tab.title = hostOf(real);
          saveState();
          renderTabs();
          syncTopbar();
        }
      }
      const title = frame.contentDocument?.title;
      const tab = activeTab();
      if (title && tab?.route === "web") {
        tab.title = title;
        saveState();
        renderTabs();
      }
    } catch {
      /* the proxied page is not readable yet; keep the tab label */
    }
  }, { once: true });
}

function renderUnavailable(title, message, note) {
  return `<section class="unavailable-page">
    <div class="unavailable-card">
      <div class="unavailable-mark">${icon("sparkle")}</div>
      <h1>${esc(title)}</h1>
      <p>${esc(message)}</p>
      <span class="unavailable-note">${esc(note)}</span>
    </div>
  </section>`;
}

function renderHome() {
  return `<section class="home">
    <h1 class="brand">lucide</h1>
    <div class="brand-underline"></div>
    <form class="home-search" id="homeSearch" autocomplete="off">
      ${icon("search")}
      <input id="homeSearchInput" type="text" placeholder="Search or enter URL" spellcheck="false" aria-label="Search or enter URL" autofocus />
    </form>
    <div class="home-footer">
      <a class="discord-pill" href="https://discord.com/" target="_blank" rel="noopener noreferrer" aria-label="Join our Discord server (opens in a new tab)">
        ${discordArt()}<span>Join Discord</span>
      </a>
      <span class="online-count">${ONLINE_COUNT}</span>
    </div>
  </section>`;
}

function renderAI() {
  resetUsageDay();
  const thread = state.threads.find((t) => t.id === state.activeThread);
  const messages = thread?.messages || [];
  const modelId = thread?.model || "deepseek";
  const model = MODELS.find((m) => m.id === modelId) || MODELS[0];
  const usage = state.usage.count;
  const threads = state.threads;

  return `<div class="ai-layout">
    <aside class="ai-sidebar">
      <div class="ai-sidebar-head">
        <span class="ai-brand">${icon("sparkle")} Lucidity AI</span>
        <div class="ai-head-actions">
          <button class="icon-btn" data-action="ai-screen" aria-label="Share screen with AI">${icon("screen")}</button>
          <button class="icon-btn" data-action="ai-search-chats" aria-label="Search chats">${icon("search")}</button>
          <button class="icon-btn" data-action="ai-new" aria-label="New chat">${icon("plus")}</button>
        </div>
      </div>
      <div class="ai-threads">
        ${threads
          .map(
            (t) => `<button class="ai-thread${t.id === state.activeThread ? " active" : ""}" data-action="ai-thread" data-id="${esc(t.id)}">
              ${icon("message")}<span>${esc(t.title)}</span>
            </button>`,
          )
          .join("")}
      </div>
      <div class="ai-usage">
        <div class="ai-usage-row"><span>Messages today</span><strong>${usage} / 50</strong></div>
        <div class="ai-progress"><span style="width:${Math.min(100, (usage / 50) * 100)}%"></span></div>
        <button class="ai-upgrade" data-action="go-plus">${icon("sparkle")} Upgrade for 1,500 messages/day</button>
      </div>
    </aside>

    <div class="ai-main">
      <div class="ai-scroll" id="aiScroll">
        ${
          messages.length
            ? `<div class="ai-messages">${messages
                .map((msg) =>
                  msg.role === "user"
                    ? `<div class="msg msg-user"><div class="msg-body">${esc(msg.text)}</div></div>`
                    : `<div class="msg msg-ai"><div class="msg-avatar">${icon("sparkle")}</div><div class="msg-body">${esc(msg.text)}</div></div>`,
                )
                .join("")}</div>`
            : `<div class="ai-welcome">
                <h1>How can Verity help?</h1>
                <p>Use the globe for live web search.</p>
                <div class="ai-suggestions">
                  ${SUGGESTIONS.slice(0, 4)
                    .map((s) => `<button class="ai-chip" data-action="ai-suggest" data-text="${esc(s)}">${esc(s)}</button>`)
                    .join("")}
                </div>
              </div>`
        }
      </div>

      <div class="ai-composer">
        <textarea id="aiInput" rows="1" placeholder="Message Lucidity AI" aria-label="Message Lucidity AI"></textarea>
        <div class="ai-composer-bar">
          <button class="composer-icon" data-action="ai-web-search" aria-label="Web search" aria-pressed="false">${icon("globe")}</button>
          <button class="composer-icon" data-action="ai-attach" aria-label="Attach image or file">${icon("image")}</button>
          <button class="model-btn" data-action="ai-model-menu" aria-label="${esc(model.name + " " + model.tag)}">
            <span class="dot" style="background:${model.color}"></span><span class="model-name">${esc(model.name)} ${esc(model.tag)}</span>
          </button>
          <button class="send-btn" data-action="ai-send" aria-label="Send" disabled>${icon("send")}</button>
        </div>
      </div>
      <div class="model-menu" id="modelMenu" hidden>
        ${MODELS.map(
          (m) => `<button class="model-option${m.id === modelId ? " active" : ""}" data-action="ai-model" data-id="${m.id}">
            <span class="dot" style="background:${m.color}"></span>${esc(m.name)} · ${esc(m.tag)}
          </button>`,
        ).join("")}
      </div>
    </div>
  </div>`;
}

function renderGames() {
  const favs = new Set(state.favorites || []);
  const query = (state.gameQuery || "").toLowerCase();
  const onlyFavs = !!state.onlyFavorites;
  const games = GAMES.filter((g) => (!onlyFavs || favs.has(g.name)) && g.name.toLowerCase().includes(query));
  return `<section class="games-page">
    <div class="games-toolbar">
      <div class="games-search">
        ${icon("search")}
        <input id="gameSearch" type="text" placeholder="Search games" value="${esc(state.gameQuery || "")}" aria-label="Search games" />
      </div>
      <button class="toolbar-btn${onlyFavs ? " active" : ""}" data-action="toggle-favorites">${icon("star")} Favorites</button>
      <button class="toolbar-btn" data-action="random-game">${icon("ai")} Random</button>
    </div>
    <div class="games-grid">
      ${games
        .map(
          (game) => `<button class="game-tile${favs.has(game.name) ? " fav" : ""}" draggable="false" data-action="open-game" data-game="${esc(game.name)}" style="--tile: radial-gradient(circle at 35% 25%, ${game.c2}, ${game.c1});">
            <span class="emoji">${game.emoji}</span>
            <span class="tile-shade"></span>
            <span class="fav-mark">${icon("star")}</span>
            <span class="play-badge">Play</span>
            <span class="tile-name">${esc(game.name)}</span>
          </button>`,
        )
        .join("")}
    </div>
    ${games.length ? "" : '<div class="games-empty">No games match that search.</div>'}
  </section>`;
}

function renderRoblox() {
  return `<section class="roblox-page">
    <div class="roblox-card">
      <div class="roblox-logo">R</div>
      <h1>LucideBlox</h1>
      <p>Play Roblox experiences in your browser. Paste a game link or a place ID to join.</p>
      <form class="roblox-form" id="robloxForm">
        <input id="robloxInput" type="text" placeholder="https://www.roblox.com/games/…" aria-label="Roblox game link or place ID" />
        <button class="btn btn-primary" type="submit">Join</button>
      </form>
      <span class="roblox-note">The LucideBlox client and Roblox servers are not included in this recreation.</span>
    </div>
  </section>`;
}

function renderAccount() {
  const mode = state.accountMode || "signin";
  if (state.user) {
    const initial = (state.user.email || "L").slice(0, 1).toUpperCase();
    return `<section class="account-wrap">
      <div class="account-card">
        <div class="account-eyebrow">${icon("sparkle")} Lucide Account</div>
        <div class="account-profile">
          <div class="avatar">${esc(initial)}</div>
          <div class="profile-email">${esc(state.user.email)}</div>
          <span class="plan-chip">${esc(state.user.plan || "Free")} plan</span>
        </div>
        <div class="account-btn-row">
          <button class="btn" data-action="go-plus">Manage Plus</button>
          <button class="btn" data-action="sign-out">Sign out</button>
        </div>
        <div class="account-note">Accounts in this recreation are stored only in this browser. Nothing is sent anywhere.</div>
      </div>
    </section>`;
  }

  if (mode === "activate") {
    return `<section class="account-wrap">
      <div class="account-card">
        <div class="account-eyebrow">${icon("sparkle")} Lucide Account</div>
        <h1>Activate your account</h1>
        <p class="account-sub">Enter the 6-digit code we emailed you, then choose a password.</p>
        <form class="account-form" id="accountForm" data-mode="activate">
          <div class="field"><label for="accCode">6-digit code</label><input id="accCode" name="code" inputmode="numeric" maxlength="6" placeholder="000000" /></div>
          <div class="field"><label for="accPassword">New password</label><input id="accPassword" name="password" type="password" placeholder="At least 8 characters" /></div>
          <button class="account-submit" type="submit">Activate account</button>
        </form>
        <div class="account-links"><button data-action="account-signin">Back to sign in</button></div>
      </div>
    </section>`;
  }

  if (mode === "signup") {
    return `<section class="account-wrap">
      <div class="account-card">
        <div class="account-eyebrow">${icon("sparkle")} Lucide Account</div>
        <h1>Create your account</h1>
        <p class="account-sub">Enter an email and choose a password. Your bookmarks, settings, and theme sync across devices.</p>
        <form class="account-form" id="accountForm" data-mode="signup">
          <div class="field"><label for="accEmail">Email</label><input id="accEmail" name="email" type="email" placeholder="you@example.com" autocomplete="email" /></div>
          <div class="field"><label for="accPassword">Password</label><input id="accPassword" name="password" type="password" placeholder="At least 8 characters" autocomplete="new-password" /></div>
          <button class="account-submit" type="submit">Create account</button>
        </form>
        <div class="account-links"><span>Already have an account?</span><button data-action="account-signin">Sign in</button></div>
      </div>
    </section>`;
  }

  return `<section class="account-wrap">
    <div class="account-card">
      <div class="account-eyebrow">${icon("sparkle")} Lucide Account</div>
      <h1>Welcome back</h1>
      <p class="account-sub">Backs up your bookmarks, settings, and theme across devices.</p>
      <form class="account-form" id="accountForm" data-mode="signin">
        <div class="field"><label for="accEmail">Email</label><input id="accEmail" name="email" type="email" placeholder="you@example.com" autocomplete="email" /></div>
        <div class="field"><label for="accPassword">Password</label><input id="accPassword" name="password" type="password" placeholder="" autocomplete="current-password" /></div>
        <button class="account-submit" type="submit" disabled>Sign in</button>
      </form>
      <div class="account-links">
        <button data-action="forgot-password">Forgot password?</button>
        <span>·</span>
        <button data-action="account-activate">First time? Activate</button>
      </div>
      <div class="account-note">Accounts in this recreation are stored only in this browser. Nothing is sent anywhere.</div>
    </div>
  </section>`;
}

function renderPlus() {
  const signedIn = demo("account") && !!state.user;
  const cta = `<p>${signedIn ? "Your account is ready." : "Checkout opens securely in a new tab."}</p><button class="btn btn-primary" data-action="checkout">Upgrade for $6.99 / month</button>`;
  return `<section class="plus-page">
    <h1 class="plus-wordmark">Lucide<span>+</span></h1>
    <p class="plus-sub">Remove ads, unlock 1,500 AI messages/day, and get Discord perks.</p>
    <div class="plus-card">
      <h2>What you get</h2>
      <ul class="plus-list">
        <li>No ads</li>
        <li>1,500 AI messages/day</li>
        <li>Exclusive Plus links</li>
        <li>Discord Plus role</li>
      </ul>
      <p class="plus-price">$6.99 / month · cancel anytime</p>
    </div>
    <div class="plus-card">
      <h2>Get Plus</h2>
      ${cta}
    </div>
    <div class="plus-footer">${icon("sparkle")} Lucide</div>
  </section>`;
}

/* ------------------------------------------------------------------ settings */
function selectRow(label, desc, setting, options, value) {
  return `<div class="setting-row">
    <div class="setting-info"><span class="setting-name">${label}</span><span class="setting-desc">${desc}</span></div>
    <select class="settings-select" data-setting="${setting}" aria-label="${label}">
      ${Object.entries(options)
        .map(([key, opt]) => `<option value="${key}"${key === value ? " selected" : ""}>${esc(opt)}</option>`)
        .join("")}
    </select>
  </div>`;
}

function toggleRow(label, desc, toggle, on) {
  return `<div class="setting-row">
    <div class="setting-info"><span class="setting-name">${label}</span><span class="setting-desc">${desc}</span></div>
    <button class="switch" type="button" role="switch" aria-checked="${on}" aria-label="${label}" data-toggle="${toggle}"></button>
  </div>`;
}

function renderSettings() {
  const s = state.settings;
  const customEngine = s.searchEngineId === "custom";
  const customDisguise = s.tabDisguise === "custom";
  const keyLabel = s.exitKey ? esc(s.exitKey) : "None";
  return `<div class="settings-page">
    <h1>Settings</h1>
    <p class="settings-sub">Search, tab cover, and privacy for your Lucide browser.</p>

    <div class="settings-card">
      <div class="settings-section-label">Backend</div>
      <div class="setting-row">
        <div class="setting-info">
          <span class="setting-name">API host</span>
          <span class="setting-desc">Using ${esc(s.apiHost === "custom" && s.apiCustom ? s.apiCustom : "lucideon.top")} (${s.apiHost === "custom" ? "custom" : "auto"}).</span>
        </div>
        <select class="settings-select" data-setting="apiHost" aria-label="API host">
          <option value="auto"${s.apiHost !== "custom" ? " selected" : ""}>Auto</option>
          <option value="custom"${s.apiHost === "custom" ? " selected" : ""}>Custom…</option>
        </select>
      </div>
      ${s.apiHost === "custom" ? `<div class="setting-row"><div class="setting-info"><span class="setting-name">Custom API URL</span><span class="setting-desc">Used for account and AI requests in the full site.</span></div><input class="settings-input" data-setting="apiCustom" value="${esc(s.apiCustom)}" placeholder="https://api.example.com" aria-label="Custom API URL" /></div>` : ""}
    </div>

    <div class="settings-card">
      <div class="settings-section-label">Browsing</div>
      ${toggleRow("Block ads on proxied sites", "Uses DNS to filter ads. Turn off if a site will not load.", "adblock", s.adblock)}
      ${toggleRow("Restore tabs on startup", "Reopen the tabs you had open last time. Off starts with a fresh new tab.", "restoreTabs", s.restoreTabs)}
    </div>

    <div class="settings-card">
      <div class="settings-section-label">Search</div>
      ${selectRow("Search engine", "Where queries are sent when you press Enter.", "searchEngineId", Object.fromEntries(Object.entries(SEARCH_ENGINES).map(([key, e]) => [key, e.name])), s.searchEngineId)}
      ${customEngine ? `<div class="setting-row"><div class="setting-info"><span class="setting-name">Custom search URL</span><span class="setting-desc">The query is appended to this URL.</span></div><input class="settings-input" data-setting="customSearchUrl" value="${esc(s.customSearchUrl)}" placeholder="https://example.com/search?q=" aria-label="Custom search URL" /></div>` : ""}
      ${toggleRow("Search suggestions", "Show suggestions while typing. Turn off to keep queries on this device until you press Enter.", "searchSuggestions", s.searchSuggestions)}
    </div>

    <div class="settings-card">
      <div class="settings-section-label">Appearance</div>
      ${selectRow("Theme", "Switching themes also sets the matching accent color.", "theme", { dark: "Dark", light: "Light", halloween: "Halloween" }, s.theme)}
      ${selectRow("Background", "Choose the animated veil or a lightweight static background.", "backgroundMode", BACKGROUNDS, s.backgroundMode)}
      <div class="setting-row">
        <div class="setting-info"><span class="setting-name">Accent color</span><span class="setting-desc">Tints the wordmark, borders, and focus rings.</span></div>
        <div class="accent-row">
          ${ACCENTS.map(
            (color) => `<button class="accent-swatch${color.toLowerCase() === (s.accent || "").toLowerCase() ? " active" : ""}" type="button" style="background:${color}" data-accent-value="${color}" aria-label="Accent ${color}"></button>`,
          ).join("")}
          <label class="color-well" title="Custom color"><input type="color" data-color="accent" value="${esc(s.accent)}" aria-label="Custom accent color" style="width:100%;height:100%;border:0;padding:0;background:transparent" /></label>
        </div>
      </div>
      ${toggleRow("Reduce motion", "Turn off interface animations and transitions. Helps on slower devices.", "reduceMotion", s.reduceMotion)}
    </div>

    <div class="settings-card">
      <div class="settings-section-label">Tab cover</div>
      ${selectRow("Tab disguise", "Change the tab's title and icon to blend in.", "tabDisguise", Object.fromEntries(Object.entries(DISGUISES).map(([key, d]) => [key, d.name])), s.tabDisguise)}
      <div class="setting-row">
        <div class="setting-info"><span class="setting-name">Tab title</span><span class="setting-desc">${customDisguise ? "Shown in the browser tab for Custom." : "Available with the Custom disguise."}</span></div>
        <input class="settings-input" data-setting="tabTitle" value="${esc(s.tabTitle)}" placeholder="Tab title" aria-label="Tab title" ${customDisguise ? "" : "disabled"} />
      </div>
      <div class="setting-row">
        <div class="setting-info"><span class="setting-name">Favicon URL</span><span class="setting-desc">${customDisguise ? "Shown in the browser tab for Custom." : "Available with the Custom disguise."}</span></div>
        <input class="settings-input" data-setting="faviconUrl" value="${esc(s.faviconUrl)}" placeholder="https://…" aria-label="Favicon URL" ${customDisguise ? "" : "disabled"} />
      </div>
    </div>

    <div class="settings-card">
      <div class="settings-section-label">Quick exit</div>
      <div class="setting-row">
        <div class="setting-info">
          <span class="setting-name">Exit key</span>
          <span class="setting-desc">Press this key anywhere to instantly bail to the exit URL. Current: <span class="key-badge">${keyLabel}</span></span>
        </div>
        <button class="settings-run" data-action="record-key">Set key</button>
      </div>
      <div class="setting-row">
        <div class="setting-info"><span class="setting-name">Exit URL</span><span class="setting-desc">Where the exit key takes you.</span></div>
        <div class="setting-form">
          <input class="settings-input" id="exitUrlInput" value="${esc(s.exitUrl)}" aria-label="Exit URL" />
          <button class="settings-run" data-action="save-exit">Save</button>
        </div>
      </div>
      ${toggleRow("Confirm before leaving", "Prompt when closing or navigating away.", "confirmLeave", s.confirmLeave)}
      ${toggleRow("Auto cover tab", "On your next interaction, move the site into a decoy tab and redirect this one.", "autoCover", s.autoCover)}
      <div class="setting-row">
        <div class="setting-info"><span class="setting-name">Open cover tab now</span><span class="setting-desc">Open the exit URL in a new tab immediately.</span></div>
        <button class="settings-run" data-action="open-cover">Open</button>
      </div>
    </div>

    <div class="settings-card">
      <div class="settings-section-label">Data</div>
      <div class="setting-row">
        <div class="setting-info"><span class="setting-name">Clear data</span><span class="setting-desc">Removes saved tabs, bookmarks, and settings.</span></div>
        <button class="settings-run" data-action="clear-data">Clear</button>
      </div>
    </div>

    <div class="settings-card">
      <div class="settings-section-label">Lucide Plus</div>
      <div class="setting-row">
        <div class="setting-info"><span class="setting-name">Go ad-free</span><span class="setting-desc">Remove ads, unlock 1,500 AI messages/day, and get exclusive links.</span></div>
        <button class="btn btn-primary" data-action="go-plus">Upgrade</button>
      </div>
    </div>

    <div class="settings-footer">${icon("sparkle")} Lucide <span>·</span> <a href="#" data-action="terms">Terms</a> <span>·</span> <a href="#" data-action="privacy">Privacy</a></div>
  </div>`;
}

/* ------------------------------------------------------------------ wiring */
function wirePage(route) {
  $$("input, textarea").forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && input.tagName !== "TEXTAREA") {
        const form = input.closest("form");
        if (form && form.id === "homeSearch") {
          event.preventDefault();
          runSearch(input.value);
        }
      }
    });
  });

  if (route === "home") {
    const form = $("#homeSearch");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      runSearch($("#homeSearchInput").value);
    });
    $("#homeSearchInput")?.focus();
  }

  if (route === "ai") {
    wireAI();
  }

  if (route === "games") {
    const search = $("#gameSearch");
    search?.addEventListener("input", () => {
      state.gameQuery = search.value;
      const page = $("#page");
      const scroll = page.scrollTop;
      renderPage();
      $("#gameSearch")?.focus();
      $("#page").scrollTop = scroll;
    });
    search?.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        state.gameQuery = "";
        renderPage();
      }
    });
  }

  if (route === "roblox") {
    $("#robloxForm")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = $("#robloxInput").value.trim();
      if (!value) return;
      toast("LucideBlox isn't included in this recreation.");
    });
  }

  if (route === "web") {
    wireWebTab();
  }

  if (route === "account") {
    wireAccount();
  }

  if (route === "settings") {
    wireSettings();
  }
}

function wireAccount() {
  const form = $("#accountForm");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const mode = form.dataset.mode;
    const email = $("#accEmail")?.value.trim() || "";
    const password = $("#accPassword")?.value || "";
    if (mode === "activate") {
      state.user = { email: "you@example.com", plan: "Free" };
      state.accountMode = "signin";
      saveState();
      toast("Account activated.");
      render();
      return;
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
      toast("Enter a valid email and a password of at least 8 characters.");
      return;
    }
    state.user = { email, plan: "Free" };
    state.accountMode = "signin";
    saveState();
    toast(mode === "signup" ? "Account created." : "Signed in.");
    render();
  });

  const emailInput = $("#accEmail");
  const passwordInput = $("#accPassword");
  const submit = $(".account-submit");
  const update = () => {
    if (!submit) return;
    if (state.accountMode === "activate" || form?.dataset.mode === "activate") {
      submit.disabled = !($("#accCode")?.value.trim().length === 6 && (passwordInput?.value.length || 0) >= 8);
    } else if (form?.dataset.mode === "signup") {
      submit.disabled = !(emailInput?.value && /^\S+@\S+\.\S+$/.test(emailInput.value) && (passwordInput?.value.length || 0) >= 8);
    } else {
      submit.disabled = !(emailInput?.value && passwordInput?.value);
    }
  };
  [emailInput, passwordInput, $("#accCode")].forEach((input) => input?.addEventListener("input", update));
  update();
}

function wireAI() {
  const input = $("#aiInput");
  const send = $('[data-action="ai-send"]');
  const scroll = $("#aiScroll");
  const resize = () => {
    if (!input) return;
    input.style.height = "auto";
    input.style.height = Math.min(140, input.scrollHeight) + "px";
  };
  input?.addEventListener("input", () => {
    if (send) send.disabled = !input.value.trim();
    resize();
  });
  input?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });
  input?.focus();
  if (scroll) scroll.scrollTop = scroll.scrollHeight;
}

function currentThread() {
  let thread = state.threads.find((t) => t.id === state.activeThread);
  if (!thread) {
    thread = { id: `th-${Date.now().toString(36)}`, title: "New chat", messages: [], model: "deepseek" };
    state.threads.push(thread);
    state.activeThread = thread.id;
  }
  return thread;
}

function sendMessage(textOverride) {
  const input = $("#aiInput");
  const text = (textOverride ?? input?.value ?? "").trim();
  if (!text) return;
  resetUsageDay();
  if (state.usage.count >= 50) {
    toast("You've reached today's message limit.");
    return;
  }
  const thread = currentThread();
  thread.messages.push({ role: "user", text });
  if (thread.title === "New chat") thread.title = text.slice(0, 42);
  state.usage.count += 1;
  if (input) input.value = "";
  saveState();
  renderPage();
  const model = MODELS.find((m) => m.id === thread.model) || MODELS[0];
  const reply = pickReply(text, model);
  const typing = document.createElement("div");
  typing.className = "msg msg-ai";
  typing.innerHTML = `<div class="msg-avatar">${icon("sparkle")}</div><div class="msg-body msg-typing"></div>`;
  const target = $("#aiScroll .ai-messages");
  if (target) {
    target.appendChild(typing);
    typing.scrollIntoView({ block: "end" });
  }
  setTimeout(() => {
    thread.messages.push({ role: "assistant", text: reply });
    saveState();
    renderPage();
  }, 900);
}

function pickReply(text, model) {
  const lower = text.toLowerCase();
  if (lower.includes("cow")) return ASSISTANT_REPLIES.cow;
  if (lower.includes("tokyo") || lower.includes("trip")) return ASSISTANT_REPLIES.tokyo;
  if (lower.includes("hamlet")) return ASSISTANT_REPLIES.hamlet;
  if (lower.includes("hiit") || lower.includes("workout")) return ASSISTANT_REPLIES.hiit;
  if (lower.includes("exit liquidity")) {
    return "Exit liquidity is the person left holding the bag when everyone else sells. In practice, becoming it means buying after the crowd has already piled in, with no plan for who buys after you.\n\nIf you're asking seriously: decide your exit before you enter, size the position so a bad outcome doesn't matter, and ignore anyone whose pitch depends on you joining last.";
  }
  if (lower.includes("landlord")) {
    return "Here's a short, polite message:\n\nHi [name],\nI wanted to flag that [issue] is still unresolved. Could you let me know when someone can take a look? I'm happy to be flexible on timing — I just want to make sure it doesn't get worse.\n\nThanks,\n[you]\n\nSwap in the specific issue and a deadline if you need one.";
  }
  return ASSISTANT_REPLIES.default + `\n\n— ${model.name}`;
}

/* ------------------------------------------------------------------ settings wiring */
function wireSettings() {
  // inputs handled by the delegated change/input listeners below
}

function recordExitKey() {
  toast("Press any key to set it as the exit key.");
  const handler = (event) => {
    event.preventDefault();
    if (["Shift", "Control", "Alt", "Meta"].includes(event.key)) return;
    state.settings.exitKey = event.key;
    saveState();
    document.removeEventListener("keydown", handler, true);
    renderPage();
    toast(`Exit key set to ${event.key}.`);
  };
  document.addEventListener("keydown", handler, true);
  modalCleanup = () => document.removeEventListener("keydown", handler, true);
}

/* ------------------------------------------------------------------ events */
document.addEventListener("click", (event) => {
  const actionEl = event.target.closest("[data-action]");
  if (!actionEl) return;
  const action = actionEl.dataset.action;

  if (action === "select-tab") {
    setActiveTab(actionEl.dataset.id);
    return;
  }
  if (action === "close-tab") {
    event.stopPropagation();
    closeTab(actionEl.dataset.id);
    return;
  }
  if (action === "open-route") {
    openRoute(actionEl.dataset.route);
    return;
  }
  if (action === "add-bookmark") {
    openModal(`
      <h2>Add bookmark</h2>
      <form id="bookmarkForm">
        <div class="field"><label for="bmLabel">Name</label><input id="bmLabel" placeholder="Example" /></div>
        <div class="field"><label for="bmUrl">URL</label><input id="bmUrl" placeholder="https://example.com" /></div>
        <div class="modal-actions"><button type="button" class="btn" data-action="close-modal">Cancel</button><button type="submit" class="btn btn-primary">Add</button></div>
      </form>
    `);
    $("#bookmarkForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const url = $("#bmUrl").value.trim();
      const label = $("#bmLabel").value.trim() || url;
      if (!/^https?:\/\//i.test(url)) {
        toast("URL must start with http:// or https://");
        return;
      }
      state.bookmarks.push({ id: `bm-${Date.now().toString(36)}`, url, label });
      saveState();
      closeModal();
      render();
    });
    return;
  }
  if (action === "remove-bookmark") {
    event.preventDefault();
    const id = actionEl.dataset.id;
    state.bookmarks = state.bookmarks.filter((b) => b.id !== id);
    saveState();
    render();
    return;
  }
  if (action === "dismiss-ads") {
    closeModal();
    return;
  }
  if (action === "close-modal") {
    closeModal();
    return;
  }
  if (action === "go-plus") {
    closeModal();
    openRoute("plus");
    return;
  }
  if (action === "ai-suggest") {
    sendMessage(actionEl.dataset.text);
    return;
  }
  if (action === "ai-send") {
    sendMessage();
    return;
  }
  if (action === "ai-new") {
    const thread = { id: `th-${Date.now().toString(36)}`, title: "New chat", messages: [], model: "deepseek" };
    state.threads.unshift(thread);
    state.activeThread = thread.id;
    saveState();
    renderPage();
    return;
  }
  if (action === "ai-thread") {
    state.activeThread = actionEl.dataset.id;
    saveState();
    renderPage();
    return;
  }
  if (action === "ai-screen") {
    toast("Screen sharing is not available in this recreation.");
    return;
  }
  if (action === "ai-search-chats") {
    toast("Chat search is not available in this recreation.");
    return;
  }
  if (action === "ai-attach") {
    toast("Attachments are not available in this recreation.");
    return;
  }
  if (action === "ai-web-search") {
    actionEl.setAttribute("aria-pressed", actionEl.getAttribute("aria-pressed") === "true" ? "false" : "true");
    return;
  }
  if (action === "ai-model-menu") {
    const menu = $("#modelMenu");
    if (menu) menu.hidden = !menu.hidden;
    return;
  }
  if (action === "ai-model") {
    const thread = currentThread();
    thread.model = actionEl.dataset.id;
    saveState();
    renderPage();
    return;
  }
  if (action === "open-game") {
    const game = GAMES.find((g) => g.name === actionEl.dataset.game);
    if (!game) return;
    const favs = new Set(state.favorites || []);
    openModal(`
      <div class="game-modal-cover" style="--tile: radial-gradient(circle at 35% 25%, ${game.c2}, ${game.c1});">${game.emoji}</div>
      <h2>${esc(game.name)}</h2>
      <div class="game-modal-meta">Education · browser game</div>
      <p>Games are listed for the recreation only — the original game files and backend are not included.</p>
      <div class="modal-actions">
        <button class="btn" data-action="toggle-game-fav" data-game="${esc(game.name)}">${favs.has(game.name) ? "Remove favorite" : "Favorite"}</button>
        <button class="btn btn-primary" data-action="play-game" data-game="${esc(game.name)}">Play</button>
      </div>
    `);
    return;
  }
  if (action === "toggle-game-fav") {
    const name = actionEl.dataset.game;
    const favs = new Set(state.favorites || []);
    if (favs.has(name)) favs.delete(name);
    else favs.add(name);
    state.favorites = [...favs];
    saveState();
    closeModal();
    renderPage();
    toast(favs.has(name) ? "Added to favorites." : "Removed from favorites.");
    return;
  }
  if (action === "play-game") {
    toast("Game files are not included in this recreation.");
    return;
  }
  if (action === "toggle-favorites") {
    state.onlyFavorites = !state.onlyFavorites;
    renderPage();
    return;
  }
  if (action === "random-game") {
    const game = GAMES[Math.floor(Math.random() * GAMES.length)];
    openModal(`
      <div class="game-modal-cover" style="--tile: radial-gradient(circle at 35% 25%, ${game.c2}, ${game.c1});">${game.emoji}</div>
      <h2>${esc(game.name)}</h2>
      <div class="game-modal-meta">Random pick · Education</div>
      <p>Games are listed for the recreation only — the original game files and backend are not included.</p>
      <div class="modal-actions"><button class="btn" data-action="close-modal">Close</button><button class="btn btn-primary" data-action="play-game">Play</button></div>
    `);
    return;
  }
  if (action === "forgot-password") {
    toast("Password reset is not available in this recreation.");
    return;
  }
  if (action === "account-activate") {
    state.accountMode = "activate";
    renderPage();
    return;
  }
  if (action === "account-signin") {
    state.accountMode = "signin";
    renderPage();
    return;
  }
  if (action === "create-account") {
    state.accountMode = "signup";
    openRoute("account");
    return;
  }
  if (action === "sign-out") {
    state.user = null;
    saveState();
    renderPage();
    toast("Signed out.");
    return;
  }
  if (action === "checkout") {
    if (config.urls.checkoutUrl) {
      window.open(config.urls.checkoutUrl, "_blank", "noopener,noreferrer");
      return;
    }
    toast("Checkout is not configured in config.js.");
    return;
  }
  if (action === "record-key") {
    recordExitKey();
    return;
  }
  if (action === "save-exit") {
    const value = $("#exitUrlInput")?.value.trim();
    if (!value || !/^https?:\/\//i.test(value)) {
      toast("Exit URL must start with http:// or https://");
      return;
    }
    state.settings.exitUrl = value;
    saveState();
    renderPage();
    toast("Exit URL saved.");
    return;
  }
  if (action === "open-cover") {
    window.open(state.settings.exitUrl || "about:blank", "_blank", "noopener,noreferrer");
    return;
  }
  if (action === "clear-data") {
    openModal(`
      <h2>Clear all data?</h2>
      <p>This removes saved tabs, bookmarks, settings and the local account from this browser.</p>
      <div class="modal-actions"><button class="btn" data-action="close-modal">Cancel</button><button class="btn btn-primary" data-action="confirm-clear">Clear</button></div>
    `);
    return;
  }
  if (action === "confirm-clear") {
    localStorage.removeItem(STORE_KEY);
    location.reload();
    return;
  }
  if (action === "terms" || action === "privacy") {
    event.preventDefault();
    openModal(`<h2>${action === "terms" ? "Terms" : "Privacy"}</h2><p>This is a front-end recreation for learning. It has no backend, sends nothing anywhere, and stores your settings only in this browser.</p><div class="modal-actions"><button class="btn btn-primary" data-action="close-modal">Okay</button></div>`);
    return;
  }
  if (action === "sidebar-toggle") {
    document.getElementById("app").classList.toggle("compact");
    return;
  }
});

// toggles + selects + inputs (delegated)
document.addEventListener("click", (event) => {
  const toggle = event.target.closest("[data-toggle]");
  if (!toggle) return;
  const key = toggle.dataset.toggle;
  state.settings[key] = !state.settings[key];
  saveState();
  applySettings();
  renderPage();
});

document.addEventListener("change", (event) => {
  const setting = event.target.closest("[data-setting]");
  if (setting) {
    const key = setting.dataset.setting;
    let value = setting.type === "checkbox" ? setting.checked : setting.value;
    if (key === "theme") {
      value = setting.value;
      state.settings.theme = value;
      state.settings.accent = THEMES[value].accent;
    } else {
      state.settings[key] = value;
    }
    saveState();
    applySettings();
    renderPage();
    return;
  }
  const color = event.target.closest("[data-color]");
  if (color) {
    state.settings[color.dataset.color] = color.value;
    saveState();
    applySettings();
    renderPage();
  }
});

document.addEventListener("click", (event) => {
  const swatch = event.target.closest("[data-accent-value]");
  if (!swatch) return;
  state.settings.accent = swatch.dataset.accentValue;
  saveState();
  applySettings();
  renderPage();
});

/* ------------------------------------------------------------------ shell events */
$("#collapseBtn")?.addEventListener("click", () => {
  const app = $("#app");
  state.sidebarCompact = !app.classList.contains("compact");
  state.sidebarAuto = false;
  app.classList.toggle("compact", state.sidebarCompact);
  saveState();
});

$("#newTabBtn")?.addEventListener("click", addTab);

$("#sideSearch")?.addEventListener("submit", (event) => {
  event.preventDefault();
  runSearch($("#sideSearchInput").value);
  $("#sideSearchInput").value = "";
});
$("#topSearch")?.addEventListener("submit", (event) => {
  event.preventDefault();
  runSearch($("#topSearchInput").value);
});
$("#topSearchInput")?.addEventListener("keydown", (event) => {
  if (event.key === "Escape") event.target.blur();
});

$("#plusToastClose")?.addEventListener("click", () => {
  state.plusDismissed = true;
  saveState();
  renderPlusToast();
});
$("#plusToastCta")?.addEventListener("click", () => openRoute("plus"));

$("#reloadBtn")?.addEventListener("click", () => {
  const frame = $("#webFrame");
  if (!frame) return;
  $("#webLoading")?.removeAttribute("hidden");
  frame.src = frame.src;
});

document.addEventListener("keydown", (event) => {
  const s = state.settings;
  if (!s.exitKey) return;
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || "");
  if (typing && event.key !== s.exitKey) return;
  if (event.key === s.exitKey) {
    event.preventDefault();
    window.location.href = s.exitUrl || "about:blank";
  }
});

window.addEventListener("beforeunload", (event) => {
  if (!state.settings.confirmLeave) return;
  event.preventDefault();
  event.returnValue = "";
});

/* ------------------------------------------------------------------ boot */
function boot() {
  const hash = location.hash.replace(/^#/, "");
  const [hashPath, hashQuery = ""] = hash.split("?");
  const webUrl = hashPath === "/web" ? new URLSearchParams(hashQuery).get("url") || "" : "";
  const routeFromHash = webUrl ? "web" : Object.entries(ROUTES).find(([, r]) => r.path === hash)?.[0];
  applySettings();

  if (!state.settings.restoreTabs) {
    state.tabs = [{ id: `tab-${Date.now().toString(36)}`, route: "home" }];
    state.activeTab = state.tabs[0].id;
  }
  if (routeFromHash) {
    const tab = {
      id: `tab-${Date.now().toString(36)}`,
      route: routeFromHash,
      url: webUrl,
      title: webUrl ? hostOf(webUrl) : "",
    };
    state.tabs = [tab];
    state.activeTab = tab.id;
  }
  render();
  if (!state.adsSeen) setTimeout(showAdsNotice, 600);
  saveState();
}

setFontObfuscation(true);
boot();
