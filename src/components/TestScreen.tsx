import { useState, useEffect } from "react"
import type { Automation, TestResult } from "../types/automation.types"
import { getWebhookPlatform } from "../services/webhookService"

interface TestScreenProps {
  automation: Automation | null
  onBack: () => void
  onTest: (automation: Automation) => Promise<TestResult>
}

export function TestScreen({ automation, onBack, onTest }: TestScreenProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TestResult | null>(null)

  const runTest = async (auto: Automation) => {
    setLoading(true)
    setResult(null)
    const r = await onTest(auto)
    setResult(r)
    setLoading(false)
  }

  useEffect(() => {
    if (!automation) return
    runTest(automation)
  }, [automation])

  if (!automation) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="text-body text-sm">No automation selected</p>
        <button onClick={onBack} className="mt-4 text-primary text-sm hover:underline">Go back</button>
      </div>
    )
  }

  const maskUrl = (url: string) => {
    try {
      const parsed = new URL(url)
      return `${parsed.protocol}//${parsed.hostname}${parsed.pathname.slice(0, 20)}...`
    } catch { return url.slice(0, 40) + "..." }
  }

  const platform = getWebhookPlatform(automation.webhookUrl)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-md text-ink hover:bg-canvas-soft border border-transparent hover:border-mute transition-all transition-colors text-sm">←</button>
        <h2 className="text-base font-bold text-ink">Test Automation</h2>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <p className="text-sm font-medium text-ink mb-1">{automation.name}</p>
        <p className="text-xs text-body mb-6 break-all">{maskUrl(automation.webhookUrl)}</p>

        {loading && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-body">Sending test payload...</p>
          </div>
        )}

        {result && !loading && (
          <div className="w-full space-y-4">
            {result.success ? (
              <div className="p-6 bg-success/10 rounded-md">
                <div className="w-14 h-14 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">✓</span>
                </div>
                <h3 className="text-lg font-display font-medium text-success mb-1">{platform} received the webhook!</h3>
                <div className="text-sm text-success/80 space-y-1">
                  <p>Status: {result.statusCode} OK</p>
                  <p>Response time: {result.responseTime}ms</p>
                </div>
                <p className="text-xs text-body mt-4">Check your history in {platform} to see the data</p>
              </div>
            ) : (
              <div className="p-6 bg-error/10 rounded-md">
                <div className="w-14 h-14 rounded-full bg-error/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">✕</span>
                </div>
                <h3 className="text-lg font-display font-medium text-error mb-1">Failed to connect to {platform}</h3>
                <p className="text-sm text-error/80 mb-3">{result.error}</p>
                <div className="text-left text-xs text-body space-y-1.5 bg-canvas-soft p-3 rounded-sm">
                  <p>• Make sure your webhook is turned ON in {platform}</p>
                  <p>• Check the webhook URL is correct</p>
                  <p>• Try creating a new webhook trigger</p>
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={() => runTest(automation)} className="flex-1 h-10 bg-canvas-soft border border-mute rounded-md text-sm text-ink font-medium hover:bg-border transition-colors">Test Again</button>
              <button onClick={onBack} className="flex-1 h-10 bg-primary text-on-primary rounded-md text-sm font-semibold hover:bg-[#e64700] transition-all shadow-sm px-4 py-2">Done</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
