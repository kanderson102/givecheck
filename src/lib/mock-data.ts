export type CompanyCategory =
  | "ai"
  | "saas"
  | "developer-tools"
  | "fintech"
  | "marketing"
  | "ecommerce"
  | "productivity"
  | "design-tools"
  | "no-code"
  | "analytics"
  | "education"
  | "health-fitness"
  | "community"
  | "content-creation"
  | "crypto-web3"
  | "customer-support"
  | "entertainment"
  | "games"
  | "green-tech"
  | "information-products"
  | "iot-hardware"
  | "legal"
  | "marketplace"
  | "mobile-apps"
  | "news-magazines"
  | "real-estate"
  | "recruiting-hr"
  | "sales"
  | "security"
  | "social-media"
  | "travel"
  | "utilities";

export interface CategoryInfo {
  label: string;
  slug: CompanyCategory;
  description: string;
}

export const categories: CategoryInfo[] = [
  { label: "Artificial Intelligence", slug: "ai", description: "AI-powered tools, LLMs, and machine learning applications." },
  { label: "SaaS", slug: "saas", description: "Software as a Service platforms for businesses and consumers." },
  { label: "Developer Tools", slug: "developer-tools", description: "Tools for software engineers, DevOps, and API services." },
  { label: "Fintech", slug: "fintech", description: "Financial technology, banking, payments, and investing." },
  { label: "Marketing", slug: "marketing", description: "Advertising, SEO, email marketing, and social media tools." },
  { label: "E-commerce", slug: "ecommerce", description: "Online stores, marketplaces, and dropshipping tools." },
  { label: "Productivity", slug: "productivity", description: "Tools to increase efficiency, task management, and workflow." },
  { label: "Design Tools", slug: "design-tools", description: "Graphic design, UI/UX, and creative software." },
  { label: "No-Code", slug: "no-code", description: "Build software and websites without writing code." },
  { label: "Analytics", slug: "analytics", description: "Data analysis, dashboards, and business intelligence." },
  { label: "Education", slug: "education", description: "EdTech, online courses, and learning platforms." },
  { label: "Health & Fitness", slug: "health-fitness", description: "Wellness, medical tech, workout apps, and mental health." },
  { label: "Community", slug: "community", description: "Forums, groups, and community management." },
  { label: "Content Creation", slug: "content-creation", description: "Tools for creators, video editing, podcasting, and writing." },
  { label: "Crypto & Web3", slug: "crypto-web3", description: "Cryptocurrency, blockchain, NFTs, and decentralized apps." },
  { label: "Customer Support", slug: "customer-support", description: "Help desk, chat bots, and customer service platforms." },
  { label: "Entertainment", slug: "entertainment", description: "Streaming, movies, music, and leisure apps." },
  { label: "Games", slug: "games", description: "Video games, esports, and gaming platforms." },
  { label: "Green Tech", slug: "green-tech", description: "Sustainability, renewable energy, and climate tech." },
  { label: "Information Products", slug: "information-products", description: "Worksheets, books, courses, and templates." },
  { label: "IoT & Hardware", slug: "iot-hardware", description: "Internet of Things, wearables, and physical tech products." },
  { label: "Legal", slug: "legal", description: "Legal tech, contracts, and compliance services." },
  { label: "Marketplace", slug: "marketplace", description: "Platforms connecting buyers and sellers." },
  { label: "Mobile Apps", slug: "mobile-apps", description: "iOS and Android applications for smartphones and tablets." },
  { label: "News & Magazines", slug: "news-magazines", description: "Journalism, newsletters, and information aggregators." },
  { label: "Real Estate", slug: "real-estate", description: "Property management, housing markets, and PropTech." },
  { label: "Recruiting & HR", slug: "recruiting-hr", description: "Hiring, talent acquisition, and human resources." },
  { label: "Sales", slug: "sales", description: "CRM, lead generation, and sales enablement tools." },
  { label: "Security", slug: "security", description: "Cybersecurity, privacy, and identity management." },
  { label: "Social Media", slug: "social-media", description: "Social networking, community building, and content sharing." },
  { label: "Travel", slug: "travel", description: "Travel booking, guides, and hospitality technology." },
  { label: "Utilities", slug: "utilities", description: "Useful tools, calculators, and converters." },
];

export interface GivingTier {
  label: string;
  slug: string;
  minPct: number;
  maxPct?: number;
}

export const givingTiers: GivingTier[] = [
  { label: "All", slug: "all", minPct: 0 },
  { label: "10% Club", slug: "10pct-club", minPct: 10 },
  { label: "5%+ Givers", slug: "5pct-plus", minPct: 5 },
  { label: "Rising Stars", slug: "rising-stars", minPct: 1, maxPct: 4.99 },
];

export interface NonprofitDonation {
  nonprofit: string;
  amountCents: number;
  pct: number;
  color: string;
}

export interface LeaderboardEntry {
  rank: number;
  company: string;
  slug: string;
  mrr: number;
  givingPct: number;
  amountCents: number;
  is10PctClub: boolean;
  avatarFallback: string;
  category: CompanyCategory;
  categoryRank: number;
  description?: string;
  website?: string;
  nonprofitDonations?: NonprofitDonation[];
}

export const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, company: "Pixel Forge", slug: "pixel-forge", mrr: 42000, givingPct: 15.0, amountCents: 630000, is10PctClub: true, avatarFallback: "PF", category: "design-tools", categoryRank: 1, description: "Professional-grade design tools for indie creators. From vector illustration to collaborative prototyping, Pixel Forge makes beautiful design accessible.", website: "https://pixelforge.design", nonprofitDonations: [{ nonprofit: "GiveDirectly", amountCents: 252000, pct: 40, color: "#f97316" }, { nonprofit: "Kiva", amountCents: 189000, pct: 30, color: "#06b6d4" }, { nonprofit: "Open Source Collective", amountCents: 126000, pct: 20, color: "#8b5cf6" }, { nonprofit: "Climate Foundation", amountCents: 63000, pct: 10, color: "#22c55e" }] },
  { rank: 2, company: "Indie Analytics", slug: "indie-analytics", mrr: 18000, givingPct: 12.5, amountCents: 225000, is10PctClub: true, avatarFallback: "IA", category: "analytics", categoryRank: 1, description: "Privacy-first analytics for bootstrapped SaaS. No cookies, no tracking scripts — just clean data you can trust.", website: "https://indieanalytics.co", nonprofitDonations: [{ nonprofit: "GiveDirectly", amountCents: 112500, pct: 50, color: "#f97316" }, { nonprofit: "Open Source Collective", amountCents: 67500, pct: 30, color: "#06b6d4" }, { nonprofit: "Hack the Commons Fund", amountCents: 45000, pct: 20, color: "#8b5cf6" }] },
  { rank: 3, company: "Shipfast Labs", slug: "shipfast-labs", mrr: 31000, givingPct: 10.0, amountCents: 310000, is10PctClub: true, avatarFallback: "SL", category: "developer-tools", categoryRank: 1, description: "Ship production-ready apps in days, not months. Boilerplates, CI/CD templates, and deployment automation for indie hackers.", website: "https://shipfastlabs.dev", nonprofitDonations: [{ nonprofit: "Open Source Collective", amountCents: 155000, pct: 50, color: "#f97316" }, { nonprofit: "Code.org", amountCents: 93000, pct: 30, color: "#06b6d4" }, { nonprofit: "GiveDirectly", amountCents: 62000, pct: 20, color: "#8b5cf6" }] },
  { rank: 4, company: "BuildStack", slug: "buildstack", mrr: 9500, givingPct: 10.0, amountCents: 95000, is10PctClub: true, avatarFallback: "BS", category: "no-code", categoryRank: 1, description: "Visual app builder for non-technical founders. Drag, drop, ship — no code required.", website: "https://buildstack.io", nonprofitDonations: [{ nonprofit: "Kiva", amountCents: 47500, pct: 50, color: "#f97316" }, { nonprofit: "GiveDirectly", amountCents: 28500, pct: 30, color: "#06b6d4" }, { nonprofit: "Room to Read", amountCents: 19000, pct: 20, color: "#8b5cf6" }] },
  { rank: 5, company: "Crafted Copy", slug: "crafted-copy", mrr: 7200, givingPct: 8.0, amountCents: 57600, is10PctClub: false, avatarFallback: "CC", category: "content-creation", categoryRank: 1, description: "AI-assisted copywriting that keeps your brand voice intact. Drafts, edits, and publishes — all from one dashboard.", website: "https://craftedcopy.com", nonprofitDonations: [{ nonprofit: "Room to Read", amountCents: 28800, pct: 50, color: "#f97316" }, { nonprofit: "GiveDirectly", amountCents: 17280, pct: 30, color: "#06b6d4" }, { nonprofit: "PEN International", amountCents: 11520, pct: 20, color: "#8b5cf6" }] },
  { rank: 6, company: "SoloSaaS", slug: "solosaas", mrr: 15000, givingPct: 7.5, amountCents: 112500, is10PctClub: false, avatarFallback: "SS", category: "saas", categoryRank: 1, description: "The all-in-one platform for solo SaaS founders. Billing, auth, analytics, and support in one package.", website: "https://solosaas.dev", nonprofitDonations: [{ nonprofit: "GiveDirectly", amountCents: 56250, pct: 50, color: "#f97316" }, { nonprofit: "Open Source Collective", amountCents: 33750, pct: 30, color: "#06b6d4" }, { nonprofit: "Kiva", amountCents: 22500, pct: 20, color: "#8b5cf6" }] },
  { rank: 7, company: "Nomad Tools", slug: "nomad-tools", mrr: 23000, givingPct: 5.0, amountCents: 115000, is10PctClub: false, avatarFallback: "NT", category: "productivity", categoryRank: 1, description: "Productivity suite built for remote teams and digital nomads. Time zones, async standups, and focus sessions.", website: "https://nomadtools.co", nonprofitDonations: [{ nonprofit: "GiveDirectly", amountCents: 57500, pct: 50, color: "#f97316" }, { nonprofit: "Room to Read", amountCents: 34500, pct: 30, color: "#06b6d4" }, { nonprofit: "Climate Foundation", amountCents: 23000, pct: 20, color: "#8b5cf6" }] },
  { rank: 8, company: "LaunchKit", slug: "launchkit", mrr: 5400, givingPct: 5.0, amountCents: 27000, is10PctClub: false, avatarFallback: "LK", category: "saas", categoryRank: 2, description: "Launch day toolkit for indie hackers. Product Hunt prep, press kit generator, and launch analytics.", website: "https://launchkit.dev", nonprofitDonations: [{ nonprofit: "Kiva", amountCents: 13500, pct: 50, color: "#f97316" }, { nonprofit: "GiveDirectly", amountCents: 13500, pct: 50, color: "#06b6d4" }] },
  { rank: 9, company: "DevRelay", slug: "devrelay", mrr: 11000, givingPct: 3.0, amountCents: 33000, is10PctClub: false, avatarFallback: "DR", category: "developer-tools", categoryRank: 2, description: "Webhook relay and API monitoring for development teams. Never miss a failed webhook again.", website: "https://devrelay.io", nonprofitDonations: [{ nonprofit: "Open Source Collective", amountCents: 16500, pct: 50, color: "#f97316" }, { nonprofit: "Code.org", amountCents: 16500, pct: 50, color: "#06b6d4" }] },
  { rank: 10, company: "Open Metrics", slug: "open-metrics", mrr: 8700, givingPct: 2.5, amountCents: 21750, is10PctClub: false, avatarFallback: "OM", category: "analytics", categoryRank: 2, description: "Open-source business metrics dashboard. Connect your Stripe, track MRR, churn, and LTV in real time.", website: "https://openmetrics.dev", nonprofitDonations: [{ nonprofit: "Open Source Collective", amountCents: 10875, pct: 50, color: "#f97316" }, { nonprofit: "GiveDirectly", amountCents: 10875, pct: 50, color: "#06b6d4" }] },
  { rank: 11, company: "CodePilot AI", slug: "codepilot-ai", mrr: 52000, givingPct: 12.0, amountCents: 624000, is10PctClub: true, avatarFallback: "CP", category: "ai", categoryRank: 1, description: "AI pair programmer that understands your entire codebase. Context-aware code generation and refactoring.", website: "https://codepilot.ai", nonprofitDonations: [{ nonprofit: "GiveDirectly", amountCents: 249600, pct: 40, color: "#f97316" }, { nonprofit: "Code.org", amountCents: 187200, pct: 30, color: "#06b6d4" }, { nonprofit: "Open Source Collective", amountCents: 124800, pct: 20, color: "#8b5cf6" }, { nonprofit: "Climate Foundation", amountCents: 62400, pct: 10, color: "#22c55e" }] },
  { rank: 12, company: "NeuralDraft", slug: "neuraldraft", mrr: 28000, givingPct: 11.0, amountCents: 308000, is10PctClub: true, avatarFallback: "ND", category: "ai", categoryRank: 2, description: "AI writing assistant for technical documentation. Generate, edit, and maintain docs that stay in sync with your code.", website: "https://neuraldraft.ai", nonprofitDonations: [{ nonprofit: "Open Source Collective", amountCents: 154000, pct: 50, color: "#f97316" }, { nonprofit: "Code.org", amountCents: 92400, pct: 30, color: "#06b6d4" }, { nonprofit: "GiveDirectly", amountCents: 61600, pct: 20, color: "#8b5cf6" }] },
  { rank: 13, company: "PayGrid", slug: "paygrid", mrr: 38000, givingPct: 10.0, amountCents: 380000, is10PctClub: true, avatarFallback: "PG", category: "fintech", categoryRank: 1, description: "Payment infrastructure for SaaS companies. Multi-currency billing, smart dunning, and revenue recovery.", website: "https://paygrid.io", nonprofitDonations: [{ nonprofit: "Kiva", amountCents: 190000, pct: 50, color: "#f97316" }, { nonprofit: "GiveDirectly", amountCents: 114000, pct: 30, color: "#06b6d4" }, { nonprofit: "Grameen Foundation", amountCents: 76000, pct: 20, color: "#8b5cf6" }] },
  { rank: 14, company: "MailRocket", slug: "mailrocket", mrr: 14000, givingPct: 10.0, amountCents: 140000, is10PctClub: true, avatarFallback: "MR", category: "marketing", categoryRank: 1, description: "Email marketing that respects your subscribers. Beautiful templates, smart segmentation, zero dark patterns.", website: "https://mailrocket.io", nonprofitDonations: [{ nonprofit: "GiveDirectly", amountCents: 70000, pct: 50, color: "#f97316" }, { nonprofit: "Room to Read", amountCents: 42000, pct: 30, color: "#06b6d4" }, { nonprofit: "Climate Foundation", amountCents: 28000, pct: 20, color: "#8b5cf6" }] },
  { rank: 15, company: "CartFlow", slug: "cartflow", mrr: 19000, givingPct: 9.5, amountCents: 180500, is10PctClub: false, avatarFallback: "CF", category: "ecommerce", categoryRank: 1 },
  { rank: 16, company: "FocusMate", slug: "focusmate", mrr: 6200, givingPct: 9.0, amountCents: 55800, is10PctClub: false, avatarFallback: "FM", category: "productivity", categoryRank: 2 },
  { rank: 17, company: "SketchSync", slug: "sketchsync", mrr: 11500, givingPct: 8.5, amountCents: 97750, is10PctClub: false, avatarFallback: "SK", category: "design-tools", categoryRank: 2 },
  { rank: 18, company: "FormCraft", slug: "formcraft", mrr: 8000, givingPct: 8.0, amountCents: 64000, is10PctClub: false, avatarFallback: "FC", category: "no-code", categoryRank: 2 },
  { rank: 19, company: "TutorNest", slug: "tutornest", mrr: 9800, givingPct: 7.5, amountCents: 73500, is10PctClub: false, avatarFallback: "TN", category: "education", categoryRank: 1 },
  { rank: 20, company: "PulseCheck", slug: "pulsecheck", mrr: 13000, givingPct: 7.0, amountCents: 91000, is10PctClub: false, avatarFallback: "PC", category: "health-fitness", categoryRank: 1 },
  { rank: 21, company: "CircleHub", slug: "circlehub", mrr: 7500, givingPct: 7.0, amountCents: 52500, is10PctClub: false, avatarFallback: "CH", category: "community", categoryRank: 1 },
  { rank: 22, company: "TokenTrail", slug: "tokentrail", mrr: 21000, givingPct: 6.5, amountCents: 136500, is10PctClub: false, avatarFallback: "TT", category: "crypto-web3", categoryRank: 1 },
  { rank: 23, company: "ReplyBot", slug: "replybot", mrr: 16000, givingPct: 6.0, amountCents: 96000, is10PctClub: false, avatarFallback: "RB", category: "customer-support", categoryRank: 1 },
  { rank: 24, company: "StreamVault", slug: "streamvault", mrr: 25000, givingPct: 6.0, amountCents: 150000, is10PctClub: false, avatarFallback: "SV", category: "entertainment", categoryRank: 1 },
  { rank: 25, company: "QuestForge", slug: "questforge", mrr: 34000, givingPct: 5.5, amountCents: 187000, is10PctClub: false, avatarFallback: "QF", category: "games", categoryRank: 1 },
  { rank: 26, company: "EcoTrack", slug: "ecotrack", mrr: 8500, givingPct: 5.5, amountCents: 46750, is10PctClub: false, avatarFallback: "ET", category: "green-tech", categoryRank: 1 },
  { rank: 27, company: "CourseKit", slug: "coursekit", mrr: 12000, givingPct: 5.0, amountCents: 60000, is10PctClub: false, avatarFallback: "CK", category: "information-products", categoryRank: 1 },
  { rank: 28, company: "SenseGrid", slug: "sensegrid", mrr: 18500, givingPct: 5.0, amountCents: 92500, is10PctClub: false, avatarFallback: "SG", category: "iot-hardware", categoryRank: 1 },
  { rank: 29, company: "ClauseAI", slug: "clauseai", mrr: 15500, givingPct: 5.0, amountCents: 77500, is10PctClub: false, avatarFallback: "CA", category: "legal", categoryRank: 1 },
  { rank: 30, company: "SwapSpot", slug: "swapspot", mrr: 20000, givingPct: 4.5, amountCents: 90000, is10PctClub: false, avatarFallback: "SP", category: "marketplace", categoryRank: 1 },
  { rank: 31, company: "AppNest", slug: "appnest", mrr: 11000, givingPct: 4.5, amountCents: 49500, is10PctClub: false, avatarFallback: "AN", category: "mobile-apps", categoryRank: 1 },
  { rank: 32, company: "PressWire", slug: "presswire", mrr: 7000, givingPct: 4.0, amountCents: 28000, is10PctClub: false, avatarFallback: "PW", category: "news-magazines", categoryRank: 1 },
  { rank: 33, company: "NestFinder", slug: "nestfinder", mrr: 27000, givingPct: 4.0, amountCents: 108000, is10PctClub: false, avatarFallback: "NF", category: "real-estate", categoryRank: 1 },
  { rank: 34, company: "HireLoop", slug: "hireloop", mrr: 16500, givingPct: 4.0, amountCents: 66000, is10PctClub: false, avatarFallback: "HL", category: "recruiting-hr", categoryRank: 1 },
  { rank: 35, company: "DealEngine", slug: "dealengine", mrr: 22000, givingPct: 3.5, amountCents: 77000, is10PctClub: false, avatarFallback: "DE", category: "sales", categoryRank: 1 },
  { rank: 36, company: "VaultKey", slug: "vaultkey", mrr: 19000, givingPct: 3.5, amountCents: 66500, is10PctClub: false, avatarFallback: "VK", category: "security", categoryRank: 1 },
  { rank: 37, company: "BuzzGrid", slug: "buzzgrid", mrr: 13500, givingPct: 3.5, amountCents: 47250, is10PctClub: false, avatarFallback: "BG", category: "social-media", categoryRank: 1 },
  { rank: 38, company: "WanderPlan", slug: "wanderplan", mrr: 10000, givingPct: 3.0, amountCents: 30000, is10PctClub: false, avatarFallback: "WP", category: "travel", categoryRank: 1 },
  { rank: 39, company: "QuickCalc", slug: "quickcalc", mrr: 4500, givingPct: 3.0, amountCents: 13500, is10PctClub: false, avatarFallback: "QC", category: "utilities", categoryRank: 1 },
  { rank: 40, company: "SynthWave AI", slug: "synthwave-ai", mrr: 45000, givingPct: 3.0, amountCents: 135000, is10PctClub: false, avatarFallback: "SW", category: "ai", categoryRank: 3 },
  { rank: 41, company: "LedgerBase", slug: "ledgerbase", mrr: 29000, givingPct: 2.5, amountCents: 72500, is10PctClub: false, avatarFallback: "LB", category: "fintech", categoryRank: 2 },
  { rank: 42, company: "ClickFunnel Pro", slug: "clickfunnel-pro", mrr: 17000, givingPct: 2.5, amountCents: 42500, is10PctClub: false, avatarFallback: "FP", category: "marketing", categoryRank: 2 },
  { rank: 43, company: "ShopStream", slug: "shopstream", mrr: 33000, givingPct: 2.5, amountCents: 82500, is10PctClub: false, avatarFallback: "SH", category: "ecommerce", categoryRank: 2 },
  { rank: 44, company: "FlowType", slug: "flowtype", mrr: 8200, givingPct: 2.0, amountCents: 16400, is10PctClub: false, avatarFallback: "FT", category: "developer-tools", categoryRank: 3 },
  { rank: 45, company: "LearnPath", slug: "learnpath", mrr: 6500, givingPct: 2.0, amountCents: 13000, is10PctClub: false, avatarFallback: "LP", category: "education", categoryRank: 2 },
  { rank: 46, company: "MindfulApp", slug: "mindfulapp", mrr: 5800, givingPct: 2.0, amountCents: 11600, is10PctClub: false, avatarFallback: "MA", category: "health-fitness", categoryRank: 2 },
  { rank: 47, company: "ChainMint", slug: "chainmint", mrr: 14500, givingPct: 1.5, amountCents: 21750, is10PctClub: false, avatarFallback: "CM", category: "crypto-web3", categoryRank: 2 },
  { rank: 48, company: "PixelDrop", slug: "pixeldrop", mrr: 9000, givingPct: 1.5, amountCents: 13500, is10PctClub: false, avatarFallback: "PD", category: "design-tools", categoryRank: 3 },
  { rank: 49, company: "TaskPilot", slug: "taskpilot", mrr: 7800, givingPct: 1.5, amountCents: 11700, is10PctClub: false, avatarFallback: "TP", category: "productivity", categoryRank: 3 },
  { rank: 50, company: "VoiceFlow", slug: "voiceflow", mrr: 12500, givingPct: 1.0, amountCents: 12500, is10PctClub: false, avatarFallback: "VF", category: "customer-support", categoryRank: 2 },
  { rank: 51, company: "DataLens", slug: "datalens", mrr: 21000, givingPct: 1.0, amountCents: 21000, is10PctClub: false, avatarFallback: "DL", category: "analytics", categoryRank: 3 },
  { rank: 52, company: "BotPress Studio", slug: "botpress-studio", mrr: 16000, givingPct: 1.0, amountCents: 16000, is10PctClub: false, avatarFallback: "BP", category: "ai", categoryRank: 4 },
  { rank: 53, company: "NovaPage", slug: "novapage", mrr: 5200, givingPct: 1.0, amountCents: 5200, is10PctClub: false, avatarFallback: "NP", category: "no-code", categoryRank: 3 },
  { rank: 54, company: "GreenGrid", slug: "greengrid", mrr: 11500, givingPct: 1.0, amountCents: 11500, is10PctClub: false, avatarFallback: "GG", category: "green-tech", categoryRank: 2 },
  { rank: 55, company: "AdPulse", slug: "adpulse", mrr: 19500, givingPct: 1.0, amountCents: 19500, is10PctClub: false, avatarFallback: "AP", category: "marketing", categoryRank: 3 },
];

export interface DashboardStats {
  currentMrr: number;
  givingPct: number;
  totalDonated: number;
  rank: number;
  totalMembers: number;
  verifiedMonths: number;
  recentDonations: {
    id: string;
    nonprofit: string;
    amount: number;
    date: string;
    verified: boolean;
  }[];
  revenueHistory: {
    month: string;
    revenue: number;
    donated: number;
  }[];
}

export interface Founder {
  name: string;
  slug: string;
  avatarFallback: string;
  title: string;
  companySlugs: string[];
  totalGivingCents: number;
  totalGivingPct: number;
  bio: string;
}

export const founders: Founder[] = [
  { name: "Maya Chen", slug: "maya-chen", avatarFallback: "MC", title: "Founder & CEO", companySlugs: ["pixel-forge", "sketchsync"], totalGivingCents: 727750, totalGivingPct: 13.6, bio: "Designer turned founder. Building tools that make creativity accessible to everyone." },
  { name: "Arun Patel", slug: "arun-patel", avatarFallback: "AP", title: "Founder", companySlugs: ["indie-analytics", "open-metrics"], totalGivingCents: 246750, totalGivingPct: 9.2, bio: "Data nerd on a mission to make analytics ethical and transparent." },
  { name: "Jake Morrison", slug: "jake-morrison", avatarFallback: "JM", title: "CEO", companySlugs: ["shipfast-labs", "devrelay", "flowtype"], totalGivingCents: 359400, totalGivingPct: 7.1, bio: "Shipping fast and giving back. Three dev tool companies, one mission." },
  { name: "Sofia Reyes", slug: "sofia-reyes", avatarFallback: "SR", title: "Founder", companySlugs: ["codepilot-ai", "neuraldraft", "synthwave-ai"], totalGivingCents: 1067000, totalGivingPct: 8.5, bio: "AI researcher building the tools that augment human potential." },
  { name: "Tom Bakker", slug: "tom-bakker", avatarFallback: "TB", title: "Founder & CEO", companySlugs: ["buildstack", "formcraft", "novapage"], totalGivingCents: 164700, totalGivingPct: 7.2, bio: "No-code evangelist. Making software creation accessible to non-technical founders." },
  { name: "Lena Kowalski", slug: "lena-kowalski", avatarFallback: "LK", title: "Founder", companySlugs: ["crafted-copy", "coursekit"], totalGivingCents: 117600, totalGivingPct: 6.1, bio: "Writer, educator, and creator economy advocate." },
  { name: "Daniel Okafor", slug: "daniel-okafor", avatarFallback: "DO", title: "CEO", companySlugs: ["solosaas", "launchkit"], totalGivingCents: 139500, totalGivingPct: 6.8, bio: "Bootstrapper helping other bootstrappers ship and scale." },
  { name: "Priya Sharma", slug: "priya-sharma", avatarFallback: "PS", title: "Founder & CEO", companySlugs: ["paygrid", "ledgerbase"], totalGivingCents: 452500, totalGivingPct: 6.8, bio: "Fintech founder on a mission to democratize financial infrastructure." },
  { name: "Elias Nguyen", slug: "elias-nguyen", avatarFallback: "EN", title: "Founder", companySlugs: ["nomad-tools", "focusmate", "taskpilot"], totalGivingCents: 179500, totalGivingPct: 5.7, bio: "Remote work advocate building the tools for the future of work." },
  { name: "Rachel Kim", slug: "rachel-kim", avatarFallback: "RK", title: "CEO", companySlugs: ["mailrocket", "clickfunnel-pro", "adpulse"], totalGivingCents: 199500, totalGivingPct: 3.9, bio: "Growth marketer turned SaaS founder. Data-driven giving." },
  { name: "Marcus Webb", slug: "marcus-webb", avatarFallback: "MW", title: "Founder", companySlugs: ["cartflow", "shopstream"], totalGivingCents: 263000, totalGivingPct: 5.1, bio: "E-commerce veteran building the next generation of online retail." },
  { name: "Nina Johansson", slug: "nina-johansson", avatarFallback: "NJ", title: "Founder & CEO", companySlugs: ["tutornest", "learnpath"], totalGivingCents: 86500, totalGivingPct: 5.3, bio: "EdTech founder passionate about making quality education universally accessible." },
  { name: "Oscar Delgado", slug: "oscar-delgado", avatarFallback: "OD", title: "Founder", companySlugs: ["ecotrack", "greengrid"], totalGivingCents: 58250, totalGivingPct: 2.9, bio: "Climate tech entrepreneur. Every line of code should help the planet." },
  { name: "Kai Tanaka", slug: "kai-tanaka", avatarFallback: "KT", title: "CEO", companySlugs: ["tokentrail", "chainmint"], totalGivingCents: 158250, totalGivingPct: 4.5, bio: "Web3 builder who believes decentralization and generosity go hand in hand." },
  { name: "Zara Ahmed", slug: "zara-ahmed", avatarFallback: "ZA", title: "Founder", companySlugs: ["replybot", "voiceflow"], totalGivingCents: 108500, totalGivingPct: 3.8, bio: "Conversational AI pioneer making customer support more human." },
];

// Map company slugs to their founder slug for easy lookup
export const companyToFounder: Record<string, string> = {};
founders.forEach((f) => {
  f.companySlugs.forEach((cs) => {
    companyToFounder[cs] = f.slug;
  });
});

export interface NonprofitDetail {
  name: string;
  slug: string;
  description: string;
  founded: number;
  founders: string[];
  impactAreas: string[];
  website: string;
  donateUrl: string;
  avatarFallback: string;
  monthlyDonors?: number;
  totalRaised?: string;
}

export const nonprofitDetails: NonprofitDetail[] = [
  { name: "GiveDirectly", slug: "givedirectly", description: "Send money directly to people living in extreme poverty. GiveDirectly delivers cash transfers to the world's poorest households, empowering them to decide what they need most. Rigorous research shows cash transfers lead to lasting gains in income, assets, and wellbeing.", founded: 2008, founders: ["Michael Faye", "Paul Niehaus"], impactAreas: ["Poverty Alleviation", "Cash Transfers", "International Development"], website: "https://givedirectly.org", donateUrl: "https://every.org/givedirectly", avatarFallback: "GD", monthlyDonors: 18400, totalRaised: "$600M+" },
  { name: "Open Source Collective", slug: "open-source-collective", description: "Fiscal host for open source projects worldwide. Supports maintainers and communities building the tools we all depend on — from small libraries to critical infrastructure. Provides financial transparency, legal entity status, and fundraising tools.", founded: 2018, founders: ["Pia Mancini", "Xavier Damman"], impactAreas: ["Open Source", "Developer Community", "Technology"], website: "https://oscollective.org", donateUrl: "https://every.org/open-source-collective", avatarFallback: "OS", monthlyDonors: 5200, totalRaised: "$45M+" },
  { name: "Climate Foundation", slug: "climate-foundation", description: "Pioneering marine permaculture and ocean-based climate solutions. Restoring ecosystems at scale to fight climate change through innovative technology that brings deep-ocean nutrients to the surface, revitalizing marine food chains and sequestering carbon.", founded: 2007, founders: ["Brian Von Herzen"], impactAreas: ["Climate Change", "Ocean Conservation", "Marine Ecosystems"], website: "https://climatefoundation.org", donateUrl: "https://every.org/climate-foundation", avatarFallback: "CF", monthlyDonors: 3100, totalRaised: "$12M+" },
  { name: "Kiva", slug: "kiva", description: "Kiva is an international nonprofit expanding financial access to help underserved communities thrive. Through microloans as small as $25, lenders on Kiva can support entrepreneurs, students, and families in over 90 countries.", founded: 2005, founders: ["Matt Flannery", "Jessica Jackley"], impactAreas: ["Microfinance", "Financial Inclusion", "Entrepreneurship"], website: "https://kiva.org", donateUrl: "https://every.org/kiva", avatarFallback: "KV", monthlyDonors: 42000, totalRaised: "$2B+" },
  { name: "Code.org", slug: "code-org", description: "Code.org is dedicated to expanding access to computer science in schools and increasing participation by young women and underrepresented minorities. Their vision is that every student in every school has the opportunity to learn computer science.", founded: 2013, founders: ["Hadi Partovi", "Ali Partovi"], impactAreas: ["Education", "Computer Science", "Youth Development"], website: "https://code.org", donateUrl: "https://every.org/code-org", avatarFallback: "CO", monthlyDonors: 9800, totalRaised: "$150M+" },
  { name: "Room to Read", slug: "room-to-read", description: "Room to Read seeks to transform the lives of millions of children in low-income communities by focusing on literacy and gender equality in education. They work in collaboration with local communities, governments, and partner organizations.", founded: 2000, founders: ["John Wood"], impactAreas: ["Education", "Literacy", "Gender Equality"], website: "https://roomtoread.org", donateUrl: "https://every.org/room-to-read", avatarFallback: "RR", monthlyDonors: 6500, totalRaised: "$780M+" },
  { name: "Grameen Foundation", slug: "grameen-foundation", description: "Grameen Foundation helps the world's poorest people, especially women, build financial resilience. They pioneer digital solutions and partnerships that help people lift themselves out of poverty with dignity.", founded: 1997, founders: ["Muhammad Yunus", "Alex Counts"], impactAreas: ["Financial Inclusion", "Women's Empowerment", "Agriculture"], website: "https://grameenfoundation.org", donateUrl: "https://every.org/grameen-foundation", avatarFallback: "GF", monthlyDonors: 2800, totalRaised: "$250M+" },
  { name: "PEN International", slug: "pen-international", description: "PEN International promotes literature and freedom of expression. They defend writers and journalists who are persecuted for their work and campaign against censorship worldwide.", founded: 1921, founders: ["Catherine Amy Dawson Scott", "John Galsworthy"], impactAreas: ["Freedom of Expression", "Literature", "Human Rights"], website: "https://pen-international.org", donateUrl: "https://every.org/pen-international", avatarFallback: "PI", monthlyDonors: 1900, totalRaised: "$35M+" },
  { name: "Hack the Commons Fund", slug: "hack-the-commons-fund", description: "Supporting open-source projects that serve the public good. Hack the Commons Fund provides grants to developers building tools for civic engagement, transparency, and digital rights.", founded: 2020, founders: ["Community Founded"], impactAreas: ["Open Source", "Civic Tech", "Digital Rights"], website: "https://hackthecommons.org", donateUrl: "https://every.org/hack-the-commons-fund", avatarFallback: "HC", monthlyDonors: 870, totalRaised: "$2.5M+" },
  { name: "Doctors Without Borders", slug: "doctors-without-borders", description: "Médecins Sans Frontières (MSF) is an independent, international medical humanitarian organization delivering emergency aid in armed conflicts, epidemics, natural disasters, and exclusion from healthcare.", founded: 1971, founders: ["Bernard Kouchner", "Max Récamier"], impactAreas: ["Emergency Medicine", "Humanitarian Aid", "Global Health"], website: "https://msf.org", donateUrl: "https://every.org/doctors-without-borders", avatarFallback: "DW", monthlyDonors: 85000, totalRaised: "$2.5B+" },
  { name: "Khan Academy", slug: "khan-academy", description: "Khan Academy offers practice exercises, instructional videos, and a personalized learning dashboard that empower learners to study at their own pace. Their mission: a free, world-class education for anyone, anywhere.", founded: 2008, founders: ["Sal Khan"], impactAreas: ["Education", "Online Learning", "STEM"], website: "https://khanacademy.org", donateUrl: "https://every.org/khan-academy", avatarFallback: "KA", monthlyDonors: 52000, totalRaised: "$400M+" },
  { name: "World Wildlife Fund", slug: "world-wildlife-fund", description: "WWF works to conserve nature and reduce the most pressing threats to the diversity of life on Earth. They operate in nearly 100 countries, protecting wildlife, wild places, and the natural resources we all depend on.", founded: 1961, founders: ["Julian Huxley", "Max Nicholson", "Peter Scott"], impactAreas: ["Conservation", "Wildlife Protection", "Climate Action"], website: "https://worldwildlife.org", donateUrl: "https://every.org/world-wildlife-fund", avatarFallback: "WW", monthlyDonors: 120000, totalRaised: "$5B+" },
];

// Map nonprofit name to slug for easy lookup
export const nonprofitNameToSlug: Record<string, string> = {};
nonprofitDetails.forEach((np) => {
  nonprofitNameToSlug[np.name] = np.slug;
});

export const dashboardStats: DashboardStats = {
  currentMrr: 18000,
  givingPct: 12.5,
  totalDonated: 13500,
  rank: 2,
  totalMembers: 87,
  verifiedMonths: 6,
  recentDonations: [
    {
      id: "1",
      nonprofit: "GiveDirectly",
      amount: 225000,
      date: "2026-03-01",
      verified: true,
    },
    {
      id: "2",
      nonprofit: "Open Source Collective",
      amount: 225000,
      date: "2026-02-01",
      verified: true,
    },
    {
      id: "3",
      nonprofit: "Climate Foundation",
      amount: 200000,
      date: "2026-01-01",
      verified: true,
    },
    {
      id: "4",
      nonprofit: "GiveDirectly",
      amount: 200000,
      date: "2025-12-01",
      verified: true,
    },
    {
      id: "5",
      nonprofit: "Hack the Commons Fund",
      amount: 180000,
      date: "2025-11-01",
      verified: true,
    },
  ],
  revenueHistory: [
    { month: "Oct", revenue: 14500, donated: 1450 },
    { month: "Nov", revenue: 15200, donated: 1800 },
    { month: "Dec", revenue: 15800, donated: 2000 },
    { month: "Jan", revenue: 16500, donated: 2000 },
    { month: "Feb", revenue: 17200, donated: 2250 },
    { month: "Mar", revenue: 18000, donated: 2250 },
  ],
};
