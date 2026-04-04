import {
  analyzeGigSafeScenario,
  type GigSafeAnalysis,
  type GigSafeScenarioInput,
} from "@/lib/gigsafe"

const API_BASE_URL = process.env.NEXT_PUBLIC_GIGSAFE_API_BASE_URL?.replace(
  /\/$/,
  ""
)

const LOCAL_SIMULATOR_LATENCY_MS = 520

type RiskResponse = Pick<
  GigSafeAnalysis,
  "weather_risk" | "traffic_risk" | "air_quality_risk" | "risk_score"
>

type PremiumResponse = Pick<GigSafeAnalysis, "premium_inr">

type PayoutResponse = Pick<
  GigSafeAnalysis,
  | "estimated_reduction_pct"
  | "expected_income_inr"
  | "estimated_actual_income_inr"
  | "estimated_lost_income_inr"
  | "coverage_ratio"
  | "payout_inr"
  | "payout_triggered"
>

type RecommendationResponse = Pick<GigSafeAnalysis, "recommendation">

function wait(duration: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration)
  })
}

async function postJson<T>(path: string, payload: unknown) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`GigSafe API request failed for ${path}`)
  }

  return (await response.json()) as T
}

export async function runScenarioAnalysis(
  input: GigSafeScenarioInput
): Promise<GigSafeAnalysis> {
  const localShape = analyzeGigSafeScenario(input)

  if (!API_BASE_URL) {
    await wait(LOCAL_SIMULATOR_LATENCY_MS)
    return localShape
  }

  const risk = await postJson<RiskResponse>("/api/v1/risk/score", input)
  const premium = await postJson<PremiumResponse>("/api/v1/premium/quote", {
    risk_score: risk.risk_score,
  })
  const payout = await postJson<PayoutResponse>("/api/v1/payout/evaluate", {
    ...input,
    ...risk,
  })
  const recommendation = await postJson<RecommendationResponse>(
    "/api/v1/policy/recommendation",
    {
      ...input,
      ...risk,
      premium_inr: premium.premium_inr,
      payout_inr: payout.payout_inr,
    }
  )

  return {
    ...localShape,
    ...risk,
    ...premium,
    ...payout,
    recommendation: recommendation.recommendation,
  }
}
