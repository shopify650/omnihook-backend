import { useState, useCallback, useMemo } from "react"
import { isValidWebhookUrl, getWebhookPlatform } from "../services/webhookService"
import { useWebhookTest } from "../hooks/useWebhookTest"

interface WebhookInputProps {
  value: string
  onChange: (url: string) => void
  onHelp?: () => void
}

type ValidationState = "idle" | "valid" | "invalid"

export function WebhookInput({ value, onChange, onHelp }: WebhookInputProps) {
  const [validation, setValidation] = useState<ValidationState>("idle")
  const { loading, result, testUrl, reset } = useWebhookTest()

  const platform = useMemo(() => {
    if (!value) return ""
    return getWebhookPlatform(value)
  }, [value])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const url = e.target.value
      onChange(url)
      if (!url) { setValidation("idle"); return }
      setValidation(isValidWebhookUrl(url) ? "valid" : "invalid")
    },
    [onChange]
  )

  const handleTest = useCallback(() => {
    if (!value) return
    testUrl(value)
  }, [value, testUrl])

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-ink">
        {platform ? `Your ${platform} Webhook URL` : "Your Webhook URL"}
      </label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="https://hook.make.com/... or https://hooks.zapier.com/..."
        className={`w-full h-9 px-3 bg-canvas-soft border rounded-sm text-sm text-ink placeholder-secondary outline-none transition-colors ${
          validation === "valid" ? "border-success" :
          validation === "invalid" ? "border-error" : "border-mute focus:border-primary"
        }`}
      />
      {validation === "valid" && <p className="text-xs text-success">Valid {platform || "webhook"} URL</p>}
      {validation === "invalid" && value && (
        <p className="text-xs text-error">Invalid URL format. Must start with http:// or https://</p>
      )}
      {onHelp && (
        <button onClick={onHelp} className="block text-xs text-primaryblue hover:underline text-left">
          Don't know how to get a webhook URL? Read the guide →
        </button>
      )}
      <button
        onClick={handleTest}
        disabled={loading || validation !== "valid"}
        className="w-full h-9 bg-canvas-soft border border-mute rounded-sm text-sm text-ink font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-border transition-colors"
      >
        {loading ? "Testing..." : "Test Connection"}
      </button>
      {result && (
        <div className={`p-3 rounded-md text-sm ${result.success ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}>
          {result.success ? (
            <>
              <p className="font-medium">Connected!</p>
              <p className="text-xs mt-1">{platform} received the test. Status: {result.statusCode} ({result.responseTime}ms)</p>
            </>
          ) : (
             <>
              <p className="font-medium">Failed</p>
              <p className="text-xs mt-1">{result.error}</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
