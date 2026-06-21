import { useState } from "react"
import type { TriggerLog } from "../types/automation.types"

interface LogScreenProps {
  logs: TriggerLog[]
  onBack: () => void
  onClear: () => void
}

function timeAgo(dateStr: string): string {
  const diffSec = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diffSec < 60) return `${diffSec}s ago`
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`
  return `${Math.floor(diffSec / 86400)}d ago`
}

type LogFilter = "all" | "success" | "failed"

export function LogScreen({ onBack }: Omit<LogScreenProps, "logs" | "onClear">) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-md text-ink hover:bg-canvas-soft border border-transparent hover:border-mute transition-all transition-colors text-sm">←</button>
        <h2 className="text-base font-bold text-ink">Trigger Log</h2>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-16 bg-canvas-soft rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">🚧</span>
        </div>
        <h3 className="text-lg font-bold text-ink mb-2">Coming Soon</h3>
        <p className="text-sm text-body">
          Currently, live website triggers cannot report back to the Framer Editor for security reasons. 
          We are building a secure backend integration so you can view your live automation logs directly in this panel!
        </p>
        <p className="text-xs text-body mt-4 bg-canvas-soft p-3 rounded-md">
          Tip: You can always view your complete, real-time trigger logs directly inside your Zapier or Make.com dashboard.
        </p>
      </div>
    </div>
  )
}
