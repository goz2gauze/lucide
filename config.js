/*
 * Lucide recreation configuration.
 *
 * This is a plain script, loaded before the app. Edit a value and reload —
 * there is no build step. Backend-driven pages are off by default and show
 * their unavailable notice instead of a fake working feature.
 *
 * The backend demo flags default to false. Set a checkout URL to open a real
 * checkout; the other API URLs are placeholders for your own integration and
 * are not called by this front end.
 */
window.LUCIDE_CONFIG = {
  // Local demos for backend pages. false = unavailable notice.
  ai: false,
  games: false,
  account: false,
  roblox: false,

  /*
   * Wisp WebSocket server used by the in-app proxy.
   * Example: "wss://wisp.example.com/" (wss:// for HTTPS sites).
   * Leave empty to keep the in-app browser off; links open in normal tabs.
   */
  wisp: "",

  /* Set to false to disable the in-app proxy even when a Wisp URL is set. */
  proxyEnabled: true,

  // Credit pill shown on every page. Keep this on a Discord invite.
  creditUrl: "https://discord.gg/",

  // Where the real services would live if you wire them up.
  aiApi: "",
  gamesApi: "",
  accountApi: "",
  checkoutUrl: "",
  robloxClient: "",
};
