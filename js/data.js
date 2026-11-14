export const SEARCH_ENGINES = {
  google: { name: "Google", url: "https://www.google.com/search?q=" },
  duckduckgo: { name: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
  bing: { name: "Bing", url: "https://www.bing.com/search?q=" },
  brave: { name: "Brave", url: "https://search.brave.com/search?q=" },
  startpage: { name: "Startpage", url: "https://www.startpage.com/sp/search?query=" },
  custom: { name: "Custom…", url: "" },
};

export const THEMES = {
  dark: { name: "Dark", accent: "#ffffff" },
  light: { name: "Light", accent: "#000000" },
  halloween: { name: "Halloween", accent: "#ff7a1a" },
};

export const BACKGROUNDS = {
  darkveil: "DarkVeil",
  reduced: "DarkVeil (reduced)",
  mesh: "CSS mesh (faster)",
  off: "Off (fastest)",
};

export const DISGUISES = {
  none: { name: "None", title: "Home", favicon: "" },
  classroom: { name: "Google Classroom", title: "Stream - Google Classroom", favicon: "https://www.google.com/s2/favicons?domain=classroom.google.com&sz=64" },
  forms: { name: "Google Forms", title: "Google Forms", favicon: "https://www.google.com/s2/favicons?domain=docs.google.com&sz=64" },
  drive: { name: "Google Drive", title: "My Drive - Google Drive", favicon: "https://www.google.com/s2/favicons?domain=drive.google.com&sz=64" },
  docs: { name: "Google Docs", title: "Untitled document - Google Docs", favicon: "https://www.google.com/s2/favicons?domain=docs.google.com&sz=64" },
  kahoot: { name: "Kahoot!", title: "Kahoot!", favicon: "https://www.google.com/s2/favicons?domain=kahoot.it&sz=64" },
  quizlet: { name: "Quizlet", title: "Quizlet", favicon: "https://www.google.com/s2/favicons?domain=quizlet.com&sz=64" },
  custom: { name: "Custom", title: "", favicon: "" },
};

export const ACCENTS = ["#ffffff", "#4c8dff", "#a06cff", "#3dd68c", "#ffd75c", "#ff9a3d", "#ff6c9a", "#ff5c5c"];

export const MODELS = [
  { id: "deepseek", name: "DeepSeek V4 Flash", tag: "Thinking", color: "#6b8afd", replies: "deepseek" },
  { id: "gpt", name: "GPT-5.1", tag: "Fast", color: "#f5f6f8", replies: "gpt" },
  { id: "claude", name: "Claude Opus 4.5", tag: "Precise", color: "#d97757", replies: "claude" },
  { id: "gemini", name: "Gemini 3 Pro", tag: "Search", color: "#4285f4", replies: "gemini" },
  { id: "qwen", name: "Qwen 3 Max", tag: "Open", color: "#615ced", replies: "qwen" },
];

export const SUGGESTIONS = [
  "What does a cow say",
  "How do i become exit liquidity?",
  "Plan a 3-day trip to Tokyo",
  "Summarize the plot of Hamlet",
  "Give me a 20-minute HIIT workout",
  "Write a message to my landlord",
];

export const ASSISTANT_REPLIES = {
  default:
    "Here's the short version: start by deciding what you actually want out of this, then work backwards from there. Break it into small steps, do the first one today, and keep the rest of the plan deliberately light.\n\nIf you tell me a little more about your constraints — time, budget, or what you've tried already — I can make this specific instead of generic.",
  cow: "A cow says “moo”. Calves use it to call their mothers, and cows have individually recognizable moos, a bit like names. There is no farm nearby, so this is the closest you're getting to the real thing today.",
  tokyo:
    "Three days in Tokyo, without exhausting yourself:\n\nDay 1 — Shibuya and Shinjuku. Start at the Scramble, walk to Miyashita Park, then take the Yamanote line to Shinjuku for the evening. \nDay 2 — Asakusa and Ueno. Senso-ji early, then the backstreets of Yanaka for lunch and the museums in Ueno if it rains.\nDay 3 — Daikanyama, Nakameguro and Ebisu. Slow coffee, canal walks, and dinner somewhere small off the main street.\n\nGet a Suica card and keep one day unplanned; Tokyo rewards wandering more than checklists.",
  hamlet:
    "Hamlet returns home to find his father dead and his mother married to his uncle, who now wears the crown. The ghost of the old king says he was murdered, and Hamlet spends the play trying to prove it while pretending to be mad.\n\nHis indecision costs lives: Polonius is stabbed behind a curtain, Ophelia drowns, and Laertes returns for revenge. The final duel is poisoned — blade and cup — and nearly everyone dies, leaving Fortinbras to take the throne.",
  hiit:
    "20 minutes, no equipment:\n\n40s work / 20s rest × 5 rounds of: squats, push-ups, reverse lunges, mountain climbers.\nThen 40/20 × 5 rounds of: burpees, high knees, plank shoulder taps, glute bridges.\nFinish with 2 minutes of easy breathing and a hamstring stretch.\n\nKeep the first round at about 70% so you can finish the last one at the same pace.",
};

export const GAMES = [
  ["Jurassic World", "🦖", "#1f3d2b", "#6f9e4a"],
  ["Tap Road", "🟣", "#0d3b3a", "#25e6c7"],
  ["Color Switch", "🎨", "#101010", "#e83fb0"],
  ["Balloon Tower", "🎈", "#1a3b63", "#7fc8ff"],
  ["Geometry Dash", "🟨", "#103a6b", "#f2b632"],
  ["Candy Rain", "🍬", "#2a1038", "#ff7bd5"],
  ["Anime Studio", "🌸", "#3b2145", "#ffb6d9"],
  ["Marble Race", "🔮", "#101a2e", "#a8c8e8"],
  ["Slither", "🐍", "#071a14", "#6fdc6f"],
  ["Advance Wars", "⚔️", "#20335c", "#e0a34e"],
  ["Stickman", "🕴️", "#1c1c10", "#c8c86a"],
  ["Super Mario Bros", "🍄", "#0e2b4a", "#e85d3f"],
  ["Pizza Tower", "🍕", "#3a1c10", "#f4a742"],
  ["Zombie Survival", "🧟", "#0c1a12", "#7abf6a"],
  ["Rocket Racer", "🚀", "#231a3d", "#b48cff"],
  ["Battle Bros", "⚔️", "#153317", "#f0c040"],
  ["Red Pixel", "👾", "#1a0b0b", "#e03b3b"],
  ["Fruit Ninja", "🍉", "#1c2b0e", "#a8d64a"],
  ["Super Shot Put", "🥎", "#0f2b18", "#8fe05a"],
  ["Farm Story", "👨‍🌾", "#1d2f17", "#c8a45a"],
  ["Paper Plane", "✈️", "#1f3550", "#f2f2f2"],
  ["Doom", "🔥", "#1a0808", "#d14b2a"],
  ["Pac-Man", "👻", "#1a1a08", "#f2d43b"],
  ["Factory Balls", "⚫", "#1c1c20", "#e8e8e8"],
  ["City Builder", "🏙️", "#0e2f3a", "#7ad4c8"],
  ["Advance GTA", "🚗", "#141c30", "#4a8fe0"],
  ["Moto X3M", "🏍️", "#2a1010", "#f07a3a"],
  ["Black Sprite", "👤", "#0a0a0a", "#d0d0d0"],
  ["Hexagon", "⬡", "#101820", "#3dd68c"],
  ["Bike Jump", "🚵", "#151d2e", "#8fb8e8"],
  ["Duck Life", "🦆", "#1b2f18", "#e8d44a"],
  ["Purple Runner", "🟪", "#24103a", "#b06cff"],
  ["Dolphin", "🐬", "#0c2438", "#6cc8f0"],
  ["TU-95", "✈️", "#2a2a2a", "#c8c8c8"],
  ["Solitaire", "🃏", "#0e2b1a", "#f0f0f0"],
  ["Orange Square", "🟧", "#3a2008", "#ff9a3d"],
  ["Curious Cat", "🐱", "#2a2218", "#f0c890"],
  ["Stick Runner", "🕺", "#101010", "#f0e6c8"],
  ["MOBA Arena", "⚔️", "#1a1030", "#9a7aff"],
  ["Processor Tycoon", "🏭", "#1a2a18", "#a8e05a"],
  ["Mushroom Quest", "🧢", "#2a1030", "#ff8ab0"],
  ["Space Shooter", "🛸", "#0a1428", "#6ad0ff"],
  ["Golf Orbit", "⛳", "#0e2b20", "#8fe0a8"],
  ["2048", "🔢", "#2a2010", "#f0c050"],
  ["Tower Defense", "🏰", "#1a1a2a", "#a0a0f0"],
  ["Tetris", "🧱", "#101820", "#e05a5a"],
  ["Minecraft Classic", "🧊", "#1a2a1a", "#7abf6a"],
  ["Rooftop Snipers", "🔫", "#1a1a24", "#f0d090"],
].map(([name, emoji, c1, c2]) => ({ name, emoji, c1, c2 }));

export const ONLINE_COUNT = "3018343";
