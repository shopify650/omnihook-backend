import { useState, useCallback } from "react"
import type { TestResult } from "../types/automation.types"
import { isValidWebhookUrl, fireWebhook } from "../services/webhookService"

interface WebhookTestState {
  loading: boolean
  result: TestResult | null
}

export function useWebhookTest() {
  const [state, setState] = useState<WebhookTestState>({ loading: false, result: null })

  const testUrl = useCallback(async (webhookUrl: string) => {
    if (!isValidWebhookUrl(webhookUrl)) {
      setState({
        loading: false,
        result: {
          success: false,
          statusCode: 0,
          responseTime: 0,
          error: "Invalid webhook URL format",
          testedAt: new Date().toISOString(),
        },
      })
      return
    }
    setState({ loading: true, result: null })
    const payload = {
      _test: true,
      automation_name: "OmniHook Connection Test",
      trigger: "connection_test",
      timestamp: new Date().toISOString(),
      message: "This is a test from OmniHook plugin",
    }
    const result = await fireWebhook(webhookUrl, payload)
    setState({
      loading: false,
      result: {
        success: result.success,
        statusCode: result.statusCode,
        responseTime: result.responseTime,
        error: result.error,
        testedAt: new Date().toISOString(),
      },
    })
  }, [])

  const reset = useCallback(() => {
    setState({ loading: false, result: null })
  }, [])

  return { loading: state.loading, result: state.result, testUrl, reset }
}
