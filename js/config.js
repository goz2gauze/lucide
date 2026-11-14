/**
 * Reads the editable values from config.js at the site root.
 * The app imports this module rather than touching window.LUCIDE_CONFIG.
 */
const external = (typeof window !== "undefined" && window.LUCIDE_CONFIG) || {};
const text = (value) => String(value || "").trim();
const on = (value) => value === true;

export const config = {
  creditUrl: text(external.creditUrl) || "https://discord.gg/",
  demos: {
    ai: on(external.ai),
    games: on(external.games),
    account: on(external.account),
    roblox: on(external.roblox),
  },
  wisp: text(external.wisp),
  proxyEnabled: external.proxyEnabled !== false,
  urls: {
    aiApi: text(external.aiApi),
    gamesApi: text(external.gamesApi),
    accountApi: text(external.accountApi),
    checkoutUrl: text(external.checkoutUrl),
    robloxClient: text(external.robloxClient),
  },
};
