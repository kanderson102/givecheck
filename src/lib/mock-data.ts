export interface LeaderboardEntry {
  rank: number;
  company: string;
  slug: string;
  mrr: number;
  givingPct: number;
  amountCents: number;
  is10PctClub: boolean;
  avatarFallback: string;
}

export const leaderboardData: LeaderboardEntry[] = [
  {
    rank: 1,
    company: "Pixel Forge",
    slug: "pixel-forge",
    mrr: 42000,
    givingPct: 15.0,
    amountCents: 630000,
    is10PctClub: true,
    avatarFallback: "PF",
  },
  {
    rank: 2,
    company: "Indie Analytics",
    slug: "indie-analytics",
    mrr: 18000,
    givingPct: 12.5,
    amountCents: 225000,
    is10PctClub: true,
    avatarFallback: "IA",
  },
  {
    rank: 3,
    company: "Shipfast Labs",
    slug: "shipfast-labs",
    mrr: 31000,
    givingPct: 10.0,
    amountCents: 310000,
    is10PctClub: true,
    avatarFallback: "SL",
  },
  {
    rank: 4,
    company: "BuildStack",
    slug: "buildstack",
    mrr: 9500,
    givingPct: 10.0,
    amountCents: 95000,
    is10PctClub: true,
    avatarFallback: "BS",
  },
  {
    rank: 5,
    company: "Crafted Copy",
    slug: "crafted-copy",
    mrr: 7200,
    givingPct: 8.0,
    amountCents: 57600,
    is10PctClub: false,
    avatarFallback: "CC",
  },
  {
    rank: 6,
    company: "SoloSaaS",
    slug: "solosaas",
    mrr: 15000,
    givingPct: 7.5,
    amountCents: 112500,
    is10PctClub: false,
    avatarFallback: "SS",
  },
  {
    rank: 7,
    company: "Nomad Tools",
    slug: "nomad-tools",
    mrr: 23000,
    givingPct: 5.0,
    amountCents: 115000,
    is10PctClub: false,
    avatarFallback: "NT",
  },
  {
    rank: 8,
    company: "LaunchKit",
    slug: "launchkit",
    mrr: 5400,
    givingPct: 5.0,
    amountCents: 27000,
    is10PctClub: false,
    avatarFallback: "LK",
  },
  {
    rank: 9,
    company: "DevRelay",
    slug: "devrelay",
    mrr: 11000,
    givingPct: 3.0,
    amountCents: 33000,
    is10PctClub: false,
    avatarFallback: "DR",
  },
  {
    rank: 10,
    company: "Open Metrics",
    slug: "open-metrics",
    mrr: 8700,
    givingPct: 2.5,
    amountCents: 21750,
    is10PctClub: false,
    avatarFallback: "OM",
  },
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
