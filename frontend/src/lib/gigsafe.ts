export type GigSafeScenarioInput = {
  city: string
  shift_start: string
  shift_hours: number
  rainfall_mm_per_hr: number
  rainfall_mm_per_day: number
  traffic_congestion_pct: number
  aqi: number
  expected_deliveries: number
  earning_per_delivery_inr: number
  policy_purchased: boolean
}

export type TimelinePoint = {
  label: string
  value: number
}

export type GigSafeAnalysis = {
  weather_risk: number
  traffic_risk: number
  air_quality_risk: number
  risk_score: number
  premium_inr: number
  estimated_reduction_pct: number
  expected_income_inr: number
  estimated_actual_income_inr: number
  estimated_lost_income_inr: number
  coverage_ratio: number
  payout_inr: number
  payout_triggered: boolean
  recommendation: string
  dominant_factor: string
  trigger_reason: string
  protection_value_ratio: number
  timeline: TimelinePoint[]
}

export type ScenarioPreset = {
  id: string
  label: string
  summary: string
  values: Partial<GigSafeScenarioInput>
}

const BASE_PREMIUM_INR = 50
const COVERAGE_RATIO = 0.7

export const DEFAULT_SCENARIO: GigSafeScenarioInput = {
  city: "Chennai",
  shift_start: "2026-03-08T09:00:00+05:30",
  shift_hours: 8,
  rainfall_mm_per_hr: 18,
  rainfall_mm_per_day: 55,
  traffic_congestion_pct: 65,
  aqi: 180,
  expected_deliveries: 25,
  earning_per_delivery_inr: 35,
  policy_purchased: true,
}

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: "steady",
    label: "Steady shift",
    summary: "Moderate operational friction with a balanced premium.",
    values: {
      rainfall_mm_per_hr: 8,
      rainfall_mm_per_day: 18,
      traffic_congestion_pct: 44,
      aqi: 102,
      shift_hours: 8,
      expected_deliveries: 25,
      earning_per_delivery_inr: 35,
      policy_purchased: true,
    },
  },
  {
    id: "monsoon",
    label: "Monsoon surge",
    summary: "Heavy rainfall and dense traffic push payout readiness higher.",
    values: {
      rainfall_mm_per_hr: 22,
      rainfall_mm_per_day: 62,
      traffic_congestion_pct: 72,
      aqi: 164,
      shift_hours: 8,
      expected_deliveries: 25,
      earning_per_delivery_inr: 35,
      policy_purchased: true,
    },
  },
  {
    id: "rush",
    label: "Rush hour",
    summary: "Peak congestion drives pricing while rainfall stays manageable.",
    values: {
      rainfall_mm_per_hr: 7,
      rainfall_mm_per_day: 14,
      traffic_congestion_pct: 86,
      aqi: 118,
      shift_hours: 7,
      expected_deliveries: 23,
      earning_per_delivery_inr: 36,
      policy_purchased: true,
    },
  },
  {
    id: "air",
    label: "Air alert",
    summary: "Pollution-heavy conditions erode efficiency even without storms.",
    values: {
      rainfall_mm_per_hr: 4,
      rainfall_mm_per_day: 10,
      traffic_congestion_pct: 58,
      aqi: 248,
      shift_hours: 8,
      expected_deliveries: 24,
      earning_per_delivery_inr: 35,
      policy_purchased: true,
    },
  },
]

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function round(value: number, decimals = 2) {
  const precision = 10 ** decimals
  return Math.round(value * precision) / precision
}

function formatTimelineLabel(shiftStart: string, offset: number) {
  const date = new Date(shiftStart)
  if (Number.isNaN(date.getTime())) {
    return `${9 + offset}:00`
  }

  date.setHours(date.getHours() + offset)

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  })
}

function getRecommendation(riskScore: number, payoutTriggered: boolean, ratio: number) {
  if (payoutTriggered || riskScore >= 0.78) {
    return "Coverage is strongly recommended for this shift."
  }

  if (riskScore >= 0.55 || (riskScore >= 0.35 && ratio >= 4)) {
    return "Coverage is recommended while operating conditions stay elevated."
  }

  if (riskScore >= 0.22 && ratio >= 4.5) {
    return "Coverage can still be worthwhile if the rider wants downside protection."
  }

  return "Coverage is optional under the current operating conditions."
}

export function getRiskTone(riskScore: number) {
  if (riskScore >= 0.8) {
    return {
      label: "Severe",
      summary: "Operational stress is concentrated and settlement readiness is high.",
    }
  }

  if (riskScore >= 0.62) {
    return {
      label: "Elevated",
      summary: "Signals are elevated and coverage is worth considering.",
    }
  }

  if (riskScore >= 0.38) {
    return {
      label: "Moderate",
      summary: "Conditions are steady but still influencing pricing.",
    }
  }

  return {
    label: "Calm",
    summary: "Conditions remain comparatively stable for this shift.",
  }
}

export function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value)
}

export function applyScenarioPreset(
  presetId: string,
  baseScenario: GigSafeScenarioInput = DEFAULT_SCENARIO
) {
  const preset = SCENARIO_PRESETS.find((item) => item.id === presetId)

  if (!preset) {
    return baseScenario
  }

  return {
    ...baseScenario,
    ...preset.values,
  }
}

export function analyzeGigSafeScenario(input: GigSafeScenarioInput): GigSafeAnalysis {
  const weather_risk = round(clamp(input.rainfall_mm_per_hr / 25, 0, 1))
  const traffic_risk = round(clamp(input.traffic_congestion_pct / 100, 0, 1))
  const air_quality_risk = round(clamp((input.aqi - 50) / 250, 0, 1))

  const risk_score = round(
    0.4 * weather_risk + 0.3 * traffic_risk + 0.3 * air_quality_risk
  )

  const premium_inr = Math.round(BASE_PREMIUM_INR * risk_score)
  const expected_income_inr =
    input.expected_deliveries * input.earning_per_delivery_inr

  const estimated_reduction_pct = round(
    clamp(
      risk_score * 0.55 +
        (input.rainfall_mm_per_day >= 50 ? 0.05 : 0) +
        (input.traffic_congestion_pct >= 75 ? 0.03 : 0) +
        (input.aqi >= 200 ? 0.02 : 0),
      0.05,
      0.85
    )
  )

  const estimated_actual_income_inr = Math.max(
    0,
    Math.round(expected_income_inr * (1 - estimated_reduction_pct))
  )
  const estimated_lost_income_inr = Math.max(
    0,
    expected_income_inr - estimated_actual_income_inr
  )
  const payout_inr = Math.round(estimated_lost_income_inr * COVERAGE_RATIO)

  const payout_triggered =
    input.policy_purchased &&
    (input.rainfall_mm_per_day >= 50 || risk_score >= 0.75)

  const dominant_factor =
    weather_risk >= traffic_risk && weather_risk >= air_quality_risk
      ? "Weather"
      : traffic_risk >= air_quality_risk
        ? "Traffic"
        : "Air quality"

  const trigger_reason = payout_triggered
    ? input.rainfall_mm_per_day >= 50
      ? "Daily rainfall crossed the 50 mm threshold, so automatic settlement is ready."
      : "The disruption risk score crossed 0.75 while coverage is active."
    : input.policy_purchased
      ? "Coverage is active, but trigger thresholds have not been crossed yet."
      : "Automatic settlement needs active coverage before a threshold can trigger."

  const protection_value_ratio = round(
    payout_inr / Math.max(premium_inr, 1),
    1
  )

  const timeline = Array.from({ length: Math.min(Math.max(input.shift_hours, 4), 8) }).map(
    (_, index) => {
      const wave = Math.sin((index / Math.max(input.shift_hours - 1, 1)) * Math.PI)
      const rainfallLift = input.rainfall_mm_per_day >= 50 ? 0.04 : 0
      const timelineValue = clamp(
        risk_score * (0.84 + wave * 0.18) + rainfallLift - index * 0.008,
        0.08,
        1
      )

      return {
        label: formatTimelineLabel(input.shift_start, index),
        value: round(timelineValue),
      }
    }
  )

  return {
    weather_risk,
    traffic_risk,
    air_quality_risk,
    risk_score,
    premium_inr,
    estimated_reduction_pct,
    expected_income_inr,
    estimated_actual_income_inr,
    estimated_lost_income_inr,
    coverage_ratio: COVERAGE_RATIO,
    payout_inr,
    payout_triggered,
    recommendation: getRecommendation(
      risk_score,
      payout_triggered,
      protection_value_ratio
    ),
    dominant_factor,
    trigger_reason,
    protection_value_ratio,
    timeline,
  }
}
