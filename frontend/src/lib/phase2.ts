export const BASE_WEEKLY_PREMIUM_INR = 49

export const CHENNAI_ZONES = [
  "Velachery",
  "T.Nagar",
  "Anna Nagar",
  "Adyar",
  "Tambaram",
  "Chromepet",
] as const

export type ZoneName = (typeof CHENNAI_ZONES)[number]

export const PLATFORM_NAMES = [
  "Zomato",
  "Swiggy",
  "Zepto",
  "Blinkit",
  "Amazon",
] as const

export type PlatformName = (typeof PLATFORM_NAMES)[number]

export const SHIFT_OPTIONS = ["morning", "afternoon", "evening"] as const

export type ShiftType = (typeof SHIFT_OPTIONS)[number]

export const PLAN_TYPES = ["BASIC", "STANDARD", "PREMIUM"] as const

export type PlanType = (typeof PLAN_TYPES)[number]

export const TRIGGER_TYPES = ["T1", "T2", "T3", "T4", "T5"] as const

export type TriggerType = (typeof TRIGGER_TYPES)[number]

export type IncomeDNA = {
  byDayOfWeek: number[]
  byShift: Record<ShiftType, number>
  zoneMultiplier: number
}

export type PlatformHealth = {
  platform: "Zomato" | "Swiggy"
  orderAcceptanceRate: number
  avgResponseTime: number
  surgeAvailable: boolean
  status: "HEALTHY" | "DEGRADED" | "OUTAGE"
  outageMinutes: number
}

export type PlatformFeedState = {
  zomato: PlatformHealth
  swiggy: PlatformHealth
}

export type ZonePoolState = {
  name: ZoneName
  poolBalance: number
  riskLevel: "LOW" | "MEDIUM" | "HIGH"
  activeWorkers: number
  claimsToday: number
}

export type PremiumCalculationInput = {
  zone: ZoneName
  platform: PlatformName
  weeklyIncome: number
  month: number
  trustCredits: number
  plan: PlanType
}

export type PremiumCalculationResult = {
  base: number
  zoneMultiplier: number
  platformMultiplier: number
  incomeMultiplier: number
  seasonMultiplier: number
  trustMultiplier: number
  planMultiplier: number
  formulaWeeklyPremium: number
  weeklyPremium: number
  monthlyPremium: number
  annualPremium: number
}

export type SCIInput = {
  rainfallMM: number
  heatIndex: number
  platformAcceptanceRate: number
  trafficDensityPercent: number
  disruptionDaysLast30: number
  hour24: number
}

export type SCIBreakdown = {
  sci: number
  weatherScore: number
  platformScore: number
  zoneCongestScore: number
  historicalDisruptScore: number
  timeOfDayScore: number
  band: "HIGH_RISK" | "MODERATE" | "SAFE"
  message: string
}

export type TriggerDefinition = {
  trigger: TriggerType
  title: string
  threshold: string
  payoutRatio: number
  mode: "AUTO" | "MANUAL_APPROVAL"
}

export const DEMO_INCOME_DNA: IncomeDNA = {
  byDayOfWeek: [820, 760, 810, 790, 850, 920, 880],
  byShift: {
    morning: 380,
    afternoon: 290,
    evening: 420,
  },
  zoneMultiplier: 1.12,
}

export const ZONE_MULTIPLIERS: Record<ZoneName, number> = {
  Velachery: 1.45,
  Adyar: 1.3,
  "T.Nagar": 1.2,
  Tambaram: 1.1,
  Chromepet: 1.05,
  "Anna Nagar": 0.85,
}

export const PLATFORM_MULTIPLIERS: Record<PlatformName, number> = {
  Zomato: 1,
  Swiggy: 1,
  Zepto: 0.95,
  Blinkit: 0.95,
  Amazon: 0.9,
}

export const PLAN_MULTIPLIERS: Record<PlanType, number> = {
  BASIC: 0.7,
  STANDARD: 1,
  PREMIUM: 1.35,
}

export const ZONE_BASE_TRAFFIC_DENSITY: Record<ZoneName, number> = {
  Velachery: 68,
  Adyar: 62,
  "T.Nagar": 65,
  Tambaram: 47,
  Chromepet: 53,
  "Anna Nagar": 39,
}

export const ZONE_DISRUPTION_DAYS_LAST_30: Record<ZoneName, number> = {
  Velachery: 18,
  Adyar: 15,
  "T.Nagar": 13,
  Tambaram: 9,
  Chromepet: 10,
  "Anna Nagar": 7,
}

export const ZONE_MICRO_POOLS: ZonePoolState[] = [
  {
    name: "Velachery",
    poolBalance: 82400,
    riskLevel: "HIGH",
    activeWorkers: 234,
    claimsToday: 12,
  },
  {
    name: "T.Nagar",
    poolBalance: 145000,
    riskLevel: "MEDIUM",
    activeWorkers: 189,
    claimsToday: 4,
  },
  {
    name: "Anna Nagar",
    poolBalance: 210000,
    riskLevel: "LOW",
    activeWorkers: 312,
    claimsToday: 1,
  },
  {
    name: "Adyar",
    poolBalance: 98500,
    riskLevel: "HIGH",
    activeWorkers: 156,
    claimsToday: 8,
  },
  {
    name: "Tambaram",
    poolBalance: 167000,
    riskLevel: "LOW",
    activeWorkers: 201,
    claimsToday: 2,
  },
  {
    name: "Chromepet",
    poolBalance: 134000,
    riskLevel: "MEDIUM",
    activeWorkers: 178,
    claimsToday: 5,
  },
]

export const TRIGGER_DEFINITIONS: TriggerDefinition[] = [
  {
    trigger: "T1",
    title: "Rainfall Red Alert",
    threshold: "IMD Red Alert (>64.5mm / 24hr)",
    payoutRatio: 1,
    mode: "AUTO",
  },
  {
    trigger: "T2",
    title: "Extreme Heat",
    threshold: ">42C sustained for 3+ hours (10am-6pm)",
    payoutRatio: 0.6,
    mode: "AUTO",
  },
  {
    trigger: "T3",
    title: "Severe AQI",
    threshold: "AQI >400 for 4+ hours",
    payoutRatio: 0.5,
    mode: "AUTO",
  },
  {
    trigger: "T4",
    title: "Civic Disruption",
    threshold: "Admin-declared zone closure",
    payoutRatio: 1,
    mode: "MANUAL_APPROVAL",
  },
  {
    trigger: "T5",
    title: "Platform Outage",
    threshold: ">70% acceptance drop for 45+ minutes",
    payoutRatio: 0.4,
    mode: "AUTO",
  },
]

export const TRUST_TIERS = [
  { tier: "Bronze", min: 0, max: 10, discountMultiplier: 1, discountPct: 0 },
  { tier: "Silver", min: 11, max: 25, discountMultiplier: 0.95, discountPct: 5 },
  { tier: "Gold", min: 26, max: 50, discountMultiplier: 0.92, discountPct: 8 },
  { tier: "Platinum", min: 51, max: Number.POSITIVE_INFINITY, discountMultiplier: 0.88, discountPct: 12 },
] as const

export const ADMIN_WEEKLY_FINANCIALS = [
  { week: "W1", premiums: 100120, claims: 36200 },
  { week: "W2", premiums: 101860, claims: 35820 },
  { week: "W3", premiums: 103240, claims: 38110 },
  { week: "W4", premiums: 104832, claims: 38240 },
  { week: "W5", premiums: 106120, claims: 39920 },
  { week: "W6", premiums: 107010, claims: 40490 },
  { week: "W7", premiums: 108340, claims: 41780 },
  { week: "W8", premiums: 109870, claims: 43120 },
]

export const CLAIMS_BY_TRIGGER_DATA = [
  { trigger: "T1", count: 62 },
  { trigger: "T2", count: 29 },
  { trigger: "T3", count: 21 },
  { trigger: "T4", count: 11 },
  { trigger: "T5", count: 56 },
]

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function round2(value: number): number {
  return Math.round(value * 100) / 100
}

function getIncomeMultiplier(weeklyIncome: number): number {
  if (weeklyIncome < 6000) {
    return 0.9
  }
  if (weeklyIncome <= 9000) {
    return 1
  }
  return 1.15
}

export function getTrustTier(credits: number) {
  return TRUST_TIERS.find((tier) => credits >= tier.min && credits <= tier.max) ?? TRUST_TIERS[0]
}

export function getSeasonMultiplier(month: number): number {
  if (month >= 6 && month <= 9) {
    return 1.35
  }
  if (month >= 10 && month <= 12) {
    return 1.25
  }
  return 0.85
}

export function calculateWeeklyPremium(input: PremiumCalculationInput): PremiumCalculationResult {
  const zoneMultiplier = ZONE_MULTIPLIERS[input.zone]
  const platformMultiplier = PLATFORM_MULTIPLIERS[input.platform]
  const incomeMultiplier = getIncomeMultiplier(input.weeklyIncome)
  const seasonMultiplier = getSeasonMultiplier(input.month)
  const trustMultiplier = getTrustTier(input.trustCredits).discountMultiplier
  const planMultiplier = PLAN_MULTIPLIERS[input.plan]

  const formulaWeeklyPremium =
    BASE_WEEKLY_PREMIUM_INR *
    zoneMultiplier *
    platformMultiplier *
    incomeMultiplier *
    seasonMultiplier *
    trustMultiplier

  const weeklyPremium = formulaWeeklyPremium * planMultiplier

  return {
    base: BASE_WEEKLY_PREMIUM_INR,
    zoneMultiplier,
    platformMultiplier,
    incomeMultiplier,
    seasonMultiplier,
    trustMultiplier,
    planMultiplier,
    formulaWeeklyPremium: round2(formulaWeeklyPremium),
    weeklyPremium: round2(weeklyPremium),
    monthlyPremium: round2(weeklyPremium * 4),
    annualPremium: round2(weeklyPremium * 52),
  }
}

export function calculateSCI(input: SCIInput): SCIBreakdown {
  const weatherScore = clamp(100 - (input.rainfallMM * 1.2 + input.heatIndex * 0.8), 0, 100)
  const platformScore = clamp(input.platformAcceptanceRate, 0, 100)
  const zoneCongestScore = clamp(100 - input.trafficDensityPercent, 0, 100)
  const historicalDisruptScore = clamp(100 - input.disruptionDaysLast30 * 3.33, 0, 100)
  const peakHour =
    (input.hour24 >= 11 && input.hour24 <= 14) ||
    (input.hour24 >= 18 && input.hour24 <= 21)
  const timeOfDayScore = peakHour ? 60 : 85

  const sci = clamp(
    weatherScore * 0.4 +
      platformScore * 0.2 +
      zoneCongestScore * 0.2 +
      historicalDisruptScore * 0.1 +
      timeOfDayScore * 0.1,
    0,
    100
  )

  if (sci < 40) {
    return {
      sci: round2(sci),
      weatherScore: round2(weatherScore),
      platformScore: round2(platformScore),
      zoneCongestScore: round2(zoneCongestScore),
      historicalDisruptScore: round2(historicalDisruptScore),
      timeOfDayScore: round2(timeOfDayScore),
      band: "HIGH_RISK",
      message: "Our model recommends staying home today. You're covered.",
    }
  }

  if (sci <= 70) {
    return {
      sci: round2(sci),
      weatherScore: round2(weatherScore),
      platformScore: round2(platformScore),
      zoneCongestScore: round2(zoneCongestScore),
      historicalDisruptScore: round2(historicalDisruptScore),
      timeOfDayScore: round2(timeOfDayScore),
      band: "MODERATE",
      message: "Proceed with caution. Coverage active.",
    }
  }

  return {
    sci: round2(sci),
    weatherScore: round2(weatherScore),
    platformScore: round2(platformScore),
    zoneCongestScore: round2(zoneCongestScore),
    historicalDisruptScore: round2(historicalDisruptScore),
    timeOfDayScore: round2(timeOfDayScore),
    band: "SAFE",
    message: "Good conditions. Ride well.",
  }
}

function nextPlatformSnapshot(current: PlatformHealth): PlatformHealth {
  const delta = Math.random() * 12 - 7
  const acceptance = clamp(current.orderAcceptanceRate + delta, 18, 99.5)
  const status =
    acceptance <= 30
      ? "OUTAGE"
      : acceptance <= 75
        ? "DEGRADED"
        : "HEALTHY"
  const outageMinutes = status === "OUTAGE" ? current.outageMinutes + 1 : 0
  const avgResponseTime = Math.round(clamp(700 + (100 - acceptance) * 28 + Math.random() * 180, 450, 4200))

  return {
    ...current,
    orderAcceptanceRate: round2(acceptance),
    avgResponseTime,
    surgeAvailable: status !== "OUTAGE",
    status,
    outageMinutes,
  }
}

export function createInitialPlatformFeed(): PlatformFeedState {
  return {
    zomato: {
      platform: "Zomato",
      orderAcceptanceRate: 94,
      avgResponseTime: 1200,
      surgeAvailable: true,
      status: "HEALTHY",
      outageMinutes: 0,
    },
    swiggy: {
      platform: "Swiggy",
      orderAcceptanceRate: 71,
      avgResponseTime: 2800,
      surgeAvailable: true,
      status: "DEGRADED",
      outageMinutes: 0,
    },
  }
}

export function updatePlatformFeed(previous: PlatformFeedState): PlatformFeedState {
  return {
    zomato: nextPlatformSnapshot(previous.zomato),
    swiggy: nextPlatformSnapshot(previous.swiggy),
  }
}

export function formatRupees(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)
}

export function estimateIncomeForTrigger(
  triggerType: TriggerType,
  dayIndex: number,
  shift: ShiftType,
  incomeDNA: IncomeDNA = DEMO_INCOME_DNA
): number {
  const safeDayIndex = clamp(dayIndex, 0, 6)
  const dailyEstimate = incomeDNA.byDayOfWeek[safeDayIndex] * incomeDNA.zoneMultiplier
  const shiftEstimate = incomeDNA.byShift[shift] * incomeDNA.zoneMultiplier

  if (triggerType === "T1" || triggerType === "T4") {
    return round2(dailyEstimate)
  }
  if (triggerType === "T2") {
    return round2(incomeDNA.byShift.afternoon * incomeDNA.zoneMultiplier)
  }
  return round2(shiftEstimate)
}

export function calculateTriggerPayout(
  triggerType: TriggerType,
  dayIndex: number,
  shift: ShiftType,
  incomeDNA: IncomeDNA = DEMO_INCOME_DNA
): number {
  const definition = TRIGGER_DEFINITIONS.find((item) => item.trigger === triggerType)
  const estimate = estimateIncomeForTrigger(triggerType, dayIndex, shift, incomeDNA)
  return round2(estimate * (definition?.payoutRatio ?? 0))
}

export function buildPlatformHistorySeries() {
  return Array.from({ length: 24 }).map((_, hour) => {
    if (hour === 14) {
      return { hour: `${hour.toString().padStart(2, "0")}:00`, zomato: 28, swiggy: 31 }
    }

    return {
      hour: `${hour.toString().padStart(2, "0")}:00`,
      zomato: round2(clamp(91 + (Math.random() * 11 - 7), 62, 99)),
      swiggy: round2(clamp(88 + (Math.random() * 12 - 8), 60, 99)),
    }
  })
}
