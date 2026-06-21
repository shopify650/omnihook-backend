import type { Automation } from "../types/automation.types"
import { TRIGGER_DISPLAY } from "../types/automation.types"
import { StatusBadge } from "./StatusBadge"

interface HookCardProps {
  automation: Automation
  onEdit: () => void
  onTest: () => void
  onToggle: () => void
  onDelete: () => void
  onCopy?: () => void
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "Never"
  const diffSec = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diffSec < 60) return `${diffSec}s ago`
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  return `${Math.floor(diffHr / 24)}d ago`
}

export function HookCard({ automation, onEdit, onTest, onToggle, onDelete, onCopy }: HookCardProps) {
  const display = TRIGGER_DISPLAY[automation.trigger]

  return (
    <div className="bg-canvas-soft border border-mute rounded-md p-4 space-y-3 hover:border-primary transition-all shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base flex-shrink-0">{display.icon}</span>
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-ink truncate">{automation.name || "Untitled"}</h3>
            <p className="text-xs text-body">{display.label}</p>
          </div>
        </div>
        <StatusBadge status={automation.status} />
      </div>
      <div className="flex items-center gap-3 text-xs text-body">
        <span>Last Tested: {timeAgo(automation.testResult?.testedAt || null)}</span>
      </div>
      <div className="flex gap-1.5 pt-1">
        <button onClick={onCopy} className="flex-1 h-7 bg-primary/10 text-primary border border-primary/20 rounded-md text-xs font-medium hover:bg-primary/20 transition-all">Copy</button>
        <button onClick={onTest} className="flex-1 h-7 bg-canvas border border-mute rounded-md text-xs font-medium text-ink hover:bg-canvas-soft hover:border-ink-soft transition-all">Test</button>
        <button onClick={onEdit} className="flex-1 h-7 bg-canvas border border-mute rounded-md text-xs font-medium text-ink hover:bg-canvas-soft hover:border-ink-soft transition-all">Edit</button>
        <button onClick={onToggle} className="flex-1 h-7 bg-canvas-soft border border-mute rounded-sm text-xs text-body hover:text-ink transition-colors">
          {automation.status === "active" ? "Pause" : "Activate"}
        </button>
        <button onClick={onDelete} className="flex-1 h-7 bg-canvas-soft border border-mute rounded-sm text-xs text-body hover:text-error hover:border-error hover:bg-[#fff0f0] transition-all">Del</button>
      </div>
    </div>
  )
}
