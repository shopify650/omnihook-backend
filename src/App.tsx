import { useState, useCallback } from "react"
import type { Screen, Automation, TestResult } from "./types/automation.types"
import { usePluginStorage } from "./hooks/usePluginStorage"
import { useAutomations } from "./hooks/useAutomations"
import { HomeScreen } from "./components/HomeScreen"
import { CreateHookScreen } from "./components/CreateHookScreen"
import { EditHookScreen } from "./components/EditHookScreen"
import { TestScreen } from "./components/TestScreen"
import { LogScreen } from "./components/LogScreen"
import { HelpScreen } from "./components/HelpScreen"
import { LicenseScreen } from "./components/LicenseScreen"
import { Toast, type ToastData } from "./components/Toast"
import { validateWhopLicense } from "./services/whopService"

export function App() {
  const { automations, logs, license, deviceId, loaded, persistAutomations, updateLogs, updateLicense } = usePluginStorage()
  const { createAutomation, updateAutomation, deleteAutomation, toggleAutomationStatus, testWebhook } =
    useAutomations(automations, logs, persistAutomations, updateLogs)

  const [screen, setScreen] = useState<Screen>("home")
  const [editId, setEditId] = useState<string | null>(null)
  const [testAutomation, setTestAutomation] = useState<Automation | null>(null)
  const [toast, setToast] = useState<ToastData | null>(null)

  const navigate = useCallback((s: Screen, automationId?: string) => {
    setScreen(s)
    setEditId(automationId ?? null)
  }, [])

  const handleCreate = useCallback(
    (name: string, description: string, trigger: any, triggerConfig: any, webhookUrl: string, payload: any) => {
      try {
        createAutomation(name, description, trigger, triggerConfig, webhookUrl, payload)
        setToast({ message: "Automation created!", type: "success" })
      } catch { setToast({ message: "Failed to create automation", type: "error" }) }
    }, [createAutomation])

  const handleTest = useCallback(async (automation: Automation) => {
    setTestAutomation(automation)
    setScreen("test")
  }, [])

  const handleRunTest = useCallback(async (automation: Automation): Promise<TestResult> => {
    return testWebhook(automation)
  }, [testWebhook])

  const handleClearLogs = useCallback(() => {
    updateLogs([])
    setToast({ message: "Logs cleared", type: "info" })
  }, [updateLogs])

  const handleVerifyLicense = useCallback(async (key: string) => {
    if (!deviceId) {
      return { status: "error" as const, message: "Device ID not initialized" }
    }
    const result = await validateWhopLicense(key, deviceId)
    if (result.status === "valid") {
      await updateLicense(key)
    }
    return result
  }, [deviceId, updateLicense])

  if (!loaded) {
    return <div className="flex items-center justify-center h-full">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  }

  if (!license) {
    return <LicenseScreen onVerify={handleVerifyLicense} />
  }

  return (
    <div className="h-full relative p-4 bg-canvas text-ink overflow-hidden">
      {screen === "home" && (
        <HomeScreen automations={automations} onNavigate={navigate}
          onToggleAutomation={toggleAutomationStatus}
          onDeleteAutomation={(id) => { deleteAutomation(id); setToast({ message: "Automation deleted", type: "info" }) }}
          onTestAutomation={handleTest} />
      )}
      {screen === "create" && <CreateHookScreen onBack={() => navigate("home")} onCreate={handleCreate} onNavigate={navigate} />}
      {screen === "edit" && (
        <EditHookScreen automations={automations} editId={editId} onBack={() => navigate("home")}
          onUpdate={(id, updates) => { updateAutomation(id, updates); setToast({ message: "Automation updated", type: "success" }) }}
          onNavigate={navigate} />
      )}
      {screen === "test" && <TestScreen automation={testAutomation} onBack={() => navigate("home")} onTest={handleRunTest} />}
      {screen === "logs" && <LogScreen logs={logs} onBack={() => navigate("home")} onClear={handleClearLogs} />}
      {screen === "help" && <HelpScreen onBack={() => navigate("home")} />}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  )
}
