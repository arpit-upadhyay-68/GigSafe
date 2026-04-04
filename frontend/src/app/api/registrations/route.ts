import { promises as fs } from "node:fs"
import path from "node:path"

import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type RegistrationRole = "worker" | "operations"

type RegistrationInput = {
  role?: RegistrationRole
  fullName?: string
  phone?: string
  platform?: string
  zone?: string
  plan?: string
  weeklyIncome?: number
  weeklyPremium?: number
}

const DATA_DIRECTORY = path.join(process.cwd(), "data")
const REGISTRATIONS_CSV = path.join(DATA_DIRECTORY, "registrations.csv")
const CSV_HEADER =
  "registration_id,role,full_name,phone,platform,zone,plan,weekly_income,weekly_premium,created_at\n"

function toRole(value: string | undefined): RegistrationRole {
  return value === "operations" ? "operations" : "worker"
}

function cleanText(value: string | undefined): string {
  return typeof value === "string" ? value.trim() : ""
}

function toNumber(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback
}

function escapeCsv(value: string | number): string {
  const normalized = String(value)
  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, "\"\"")}"`
  }
  return normalized
}

function isValidPhone(phone: string): boolean {
  return phone.replace(/\D/g, "").length >= 10
}

async function ensureCsvStore(): Promise<void> {
  await fs.mkdir(DATA_DIRECTORY, { recursive: true })

  try {
    await fs.access(REGISTRATIONS_CSV)
  } catch {
    await fs.writeFile(REGISTRATIONS_CSV, CSV_HEADER, { encoding: "utf8" })
  }
}

function buildRegistrationId(role: RegistrationRole): string {
  const prefix = role === "operations" ? "OPS" : "WRK"
  const nonce = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `${prefix}-${Date.now()}-${nonce}`
}

export async function POST(request: Request) {
  let input: RegistrationInput

  try {
    input = (await request.json()) as RegistrationInput
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload." }, { status: 400 })
  }

  const role = toRole(input.role)
  const fullName = cleanText(input.fullName)
  const phone = cleanText(input.phone)
  const platform = cleanText(input.platform)
  const zone = cleanText(input.zone)
  const plan = cleanText(input.plan)
  const weeklyIncome = toNumber(input.weeklyIncome, 0)
  const weeklyPremium = toNumber(input.weeklyPremium, 0)

  if (!fullName) {
    return NextResponse.json({ message: "Full name is required." }, { status: 400 })
  }
  if (!isValidPhone(phone)) {
    return NextResponse.json({ message: "A valid phone number is required." }, { status: 400 })
  }
  if (!platform || !zone || !plan) {
    return NextResponse.json({ message: "Platform, zone, and plan are required." }, { status: 400 })
  }

  const registrationId = buildRegistrationId(role)
  const createdAt = new Date().toISOString()
  const csvRow =
    [
      registrationId,
      role,
      fullName,
      phone,
      platform,
      zone,
      plan,
      weeklyIncome.toFixed(2),
      weeklyPremium.toFixed(2),
      createdAt,
    ]
      .map(escapeCsv)
      .join(",") + "\n"

  try {
    await ensureCsvStore()
    await fs.appendFile(REGISTRATIONS_CSV, csvRow, { encoding: "utf8" })
  } catch (error) {
    return NextResponse.json(
      {
        message: "Unable to store registration at the moment.",
        error: error instanceof Error ? error.message : "Unknown storage error",
      },
      { status: 500 }
    )
  }

  return NextResponse.json({
    message: "Registration saved.",
    registrationId,
  })
}
