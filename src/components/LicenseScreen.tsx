import { useState } from "react"

interface LicenseScreenProps {
  onVerify: (key: string) => Promise<{ status: "valid" | "invalid" | "error"; message?: string }>
}

export function LicenseScreen({ onVerify }: LicenseScreenProps) {
  const [licenseKey, setLicenseKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = async () => {
    if (!licenseKey.trim()) return
    setLoading(true)
    setError(null)
    
    try {
      const result = await onVerify(licenseKey.trim())
      if (result.status !== "valid") {
        setError(result.message || "Invalid license key.")
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-canvas items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
        <span className="text-3xl">🔑</span>
      </div>
      <h1 className="text-xl font-display font-bold text-ink mb-2">Activate OmniHook</h1>
      <p className="text-sm text-body mb-8 max-w-[250px]">
        Please enter your Whop license key to unlock universal webhooks for Framer.
      </p>

      <div className="w-full max-w-[300px] space-y-4">
        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-medium text-ink">License Key</label>
          <input
            type="text"
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)}
            placeholder="XXXX-XXXX-XXXX-XXXX"
            className={`w-full h-10 px-3 bg-canvas-soft border rounded-md text-sm text-ink placeholder-secondary outline-none transition-colors ${
              error ? "border-error focus:border-error" : "border-mute focus:border-primary"
            }`}
          />
          {error && <p className="text-xs text-error mt-1">{error}</p>}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || !licenseKey.trim()}
          className="w-full h-10 bg-primary text-on-primary rounded-md text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          {loading ? "Verifying..." : "Unlock Plugin"}
        </button>

        <p className="text-xs text-body pt-4">
          Don't have a key?{" "}
          <a href="https://whop.com/omnihook/omni-hook/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
            Get one here →
          </a>
        </p>
      </div>
    </div>
  )
}
