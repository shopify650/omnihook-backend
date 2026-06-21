import { useState, useEffect, useCallback } from "react"
import { loadAutomations, saveAutomations, loadTriggerLog, saveTriggerLog, loadLicenseKey, saveLicenseKey, loadDeviceId, saveDeviceId } from "../services/storageService"
import { validateWhopLicense, generateDeviceId } from "../services/whopService"
import type { Automation, TriggerLog } from "../types/automation.types"

export function usePluginStorage() {
  const [automations, setAutomations] = useState<Automation[]>([])
  const [logs, setLogs] = useState<TriggerLog[]>([])
  const [license, setLicense] = useState<string | null>(null)
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        const loadedAutomations = await loadAutomations()
        setAutomations(loadedAutomations)
        setLogs(loadTriggerLog())

        // Load or generate device ID
        let storedDeviceId = await loadDeviceId()
        if (!storedDeviceId) {
          storedDeviceId = generateDeviceId()
          await saveDeviceId(storedDeviceId)
        }
        setDeviceId(storedDeviceId)

        // Validate license with device ID
        const storedLicense = await loadLicenseKey()
        if (storedLicense && storedDeviceId) {
          const validation = await validateWhopLicense(storedLicense, storedDeviceId)
          if (validation.status === "valid") {
            setLicense(storedLicense)
          } else {
            await saveLicenseKey("")
            setLicense(null)
          }
        }
      } catch (error) {
        console.error("Failed to load plugin data:", error)
      } finally {
        setLoaded(true)
      }
    }
    init()
  }, [])

  const persistAutomations = useCallback(async (updated: Automation[]) => {
    setAutomations(updated)
    await saveAutomations(updated)
  }, [])

  const updateLogs = useCallback((updated: TriggerLog[]) => {
    setLogs(updated)
    saveTriggerLog(updated)
  }, [])

  const updateLicense = useCallback(async (key: string) => {
    setLicense(key)
    await saveLicenseKey(key)
  }, [])

  return { automations, logs, license, deviceId, loaded, persistAutomations, updateLogs, updateLicense }
}
