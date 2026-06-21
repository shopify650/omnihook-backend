import { useCallback } from "react"
import type { Automation, AutomationStatus, TriggerType, TriggerConfig, PayloadField, TestResult, TriggerLog } from "../types/automation.types"
import { fireWebhook, buildPayload } from "../services/webhookService"

let idCounter = 0
function generateId(): string {
  idCounter++
  return `auto_${Date.now()}_${idCounter}_${Math.random().toString(36).slice(2, 9)}`
}

export function useAutomations(
  automations: Automation[],
  logs: TriggerLog[],
  persistAutomations: (updated: Automation[]) => Promise<void>,
  updateLogs: (updated: TriggerLog[]) => void
) {
  const createAutomation = useCallback(
    (name: string, description: string, trigger: TriggerType, triggerConfig: TriggerConfig, webhookUrl: string, payload: PayloadField[]): Automation => {
      const now = new Date().toISOString()
      const automation: Automation = {
        id: generateId(),
        name,
        description,
        trigger,
        triggerConfig,
        webhookUrl,
        payload,
        status: "active",
        createdAt: now,
        updatedAt: now,
        lastFiredAt: null,
        fireCount: 0,
        testResult: null,
      }
      const updated = [...automations, automation]
      persistAutomations(updated)
      return automation
    },
    [automations, persistAutomations]
  )

  const updateAutomation = useCallback(
    (id: string, updates: Partial<Automation>) => {
      const updated = automations.map((a) =>
        a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
      )
      persistAutomations(updated)
    },
    [automations, persistAutomations]
  )

  const deleteAutomation = useCallback(
    (id: string) => {
      const updated = automations.filter((a) => a.id !== id)
      persistAutomations(updated)
    },
    [automations, persistAutomations]
  )

  const toggleAutomationStatus = useCallback(
    (id: string) => {
      const updated = automations.map((a) => {
        if (a.id !== id) return a
        const newStatus: AutomationStatus = a.status === "active" ? "paused" : "active"
        return { ...a, status: newStatus, updatedAt: new Date().toISOString() }
      })
      persistAutomations(updated)
    },
    [automations, persistAutomations]
  )

  const testWebhook = useCallback(
    async (automation: Automation): Promise<TestResult> => {
      const context = {
        pageUrl: window.location.href,
        pageTitle: document.title,
        pagePath: window.location.pathname,
        referrer: document.referrer,
      }
      const payload = buildPayload(automation, context)
      const result = await fireWebhook(automation.webhookUrl, payload)
      const testResult: TestResult = {
        success: result.success,
        statusCode: result.statusCode,
        responseTime: result.responseTime,
        error: result.error,
        testedAt: new Date().toISOString(),
      }
      const updated = automations.map((a) =>
        a.id === automation.id ? { ...a, testResult, updatedAt: new Date().toISOString() } : a
      )
      persistAutomations(updated)
      return testResult
    },
    [automations, persistAutomations]
  )

  const recordTrigger = useCallback(
    (automation: Automation, payload: Record<string, unknown>, success: boolean, statusCode?: number, error?: string, responseTime?: number) => {
      const log: TriggerLog = {
        id: generateId(),
        automationId: automation.id,
        automationName: automation.name,
        firedAt: new Date().toISOString(),
        payload,
        status: success ? "success" : "failed",
        statusCode,
        error,
        webhookUrl: automation.webhookUrl,
        responseTime: responseTime ?? 0,
      }
      const updatedLogs = [log, ...logs].slice(0, 50)
      updateLogs(updatedLogs)
      const updatedAutomations = automations.map((a) =>
        a.id === automation.id
          ? { ...a, lastFiredAt: new Date().toISOString(), fireCount: a.fireCount + 1, updatedAt: new Date().toISOString() }
          : a
      )
      persistAutomations(updatedAutomations)
    },
    [automations, logs, persistAutomations, updateLogs]
  )

  return { createAutomation, updateAutomation, deleteAutomation, toggleAutomationStatus, testWebhook, recordTrigger }
}
