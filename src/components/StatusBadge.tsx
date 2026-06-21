import type { AutomationStatus } from "../types/automation.types"

interface StatusBadgeProps {
  status: AutomationStatus
}

const statusStyles: Record<AutomationStatus, string> = {
  active: "bg-success/20 text-success",
  paused: "bg-secondary/20 text-body",
  error: "bg-error/20 text-error",
}

const statusLabels: Record<AutomationStatus, string> = {
  active: "Active",
  paused: "Paused",
  error: "Error",
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-pill text-xs font-medium ${statusStyles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === "active" ? "bg-success" : status === "paused" ? "bg-secondary" : "bg-error"}`} />
      {statusLabels[status]}
    </span>
  )
}
