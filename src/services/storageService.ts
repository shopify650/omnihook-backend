import { framer } from "@framer/plugin"
import type { Automation, TriggerLog } from "../types/automation.types"

const STORAGE_KEY = "omnihook_automations"
const LOG_STORAGE_KEY = "omnihook_logs"
const MAX_LOG_ENTRIES = 50

export async function saveAutomations(automations: Automation[]): Promise<void> {
  const json = JSON.stringify(automations)
  const bytes = new Blob([json]).size
  if (bytes > 90000) {
    console.warn("OmniHook: Storage approaching 100KB limit")
  }
  await framer.setPluginData(STORAGE_KEY, json)
}

export async function loadAutomations(): Promise<Automation[]> {
  const json = await framer.getPluginData(STORAGE_KEY)
  if (!json) return []
  try {
    const parsed = JSON.parse(json)
    if (!Array.isArray(parsed)) return []
    return parsed as Automation[]
  } catch {
    return []
  }
}

export function saveTriggerLog(logs: TriggerLog[]): void {
  const trimmed = logs.slice(0, MAX_LOG_ENTRIES)
  localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(trimmed))
}

export function loadTriggerLog(): TriggerLog[] {
  const json = localStorage.getItem(LOG_STORAGE_KEY)
  if (!json) return []
  try {
    return JSON.parse(json) as TriggerLog[]
  } catch {
    return []
  }
}

// Store user-specific secrets (license key, device id) in localStorage rather than project plugin data.
export async function saveLicenseKey(key: string): Promise<void> {
  try {
    localStorage.setItem("omnihook_license", key)
  } catch (e) {
    console.warn("OmniHook: Failed to save license to localStorage", e)
  }
}

export async function loadLicenseKey(): Promise<string | null> {
  try {
    return localStorage.getItem("omnihook_license")
  } catch {
    return null
  }
}

export async function saveDeviceId(deviceId: string): Promise<void> {
  try {
    localStorage.setItem("omnihook_device_id", deviceId)
  } catch (e) {
    console.warn("OmniHook: Failed to save device id to localStorage", e)
  }
}

export async function loadDeviceId(): Promise<string | null> {
  try {
    return localStorage.getItem("omnihook_device_id")
  } catch {
    return null
  }
}
