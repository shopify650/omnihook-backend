import { framer } from "@framer/plugin"
import type { Automation, Screen } from "../types/automation.types"
import { HookCard } from "./HookCard"
import HookTriggerCode from "../../component/HookTrigger.tsx?raw"

interface HomeScreenProps {
  automations: Automation[]
  onNavigate: (screen: Screen, automationId?: string) => void
  onToggleAutomation: (id: string) => void
  onDeleteAutomation: (id: string) => void
  onTestAutomation: (automation: Automation) => void
}

export function HomeScreen({ automations, onNavigate, onToggleAutomation, onDeleteAutomation, onTestAutomation }: HomeScreenProps) {
  const activeAutomations = automations.filter((a) => a.status === "active")
  const pausedAutomations = automations.filter((a) => a.status === "paused")
  const errorAutomations = automations.filter((a) => a.status === "error")

  const handleCopySpecificComponent = async (automation: Automation) => {
    try {
      let code = HookTriggerCode
      
      const safeName = automation.name.replace(/[^a-zA-Z0-9]/g, "") || "OmniHook"
      const componentName = safeName.charAt(0).toUpperCase() + safeName.slice(1)

      code = code.replace(/export default function HookTrigger/g, `export default function ${componentName}`)
      code = code.replace(/addPropertyControls\(HookTrigger/g, `addPropertyControls(${componentName}`)
      code = code.replace(/⚡ HookTrigger/g, `⚡ ${componentName}`)

      // Inject default values based on automation
      code = code.replace(/defaultValue: "page_view"/, `defaultValue: "${automation.trigger}"`)
      code = code.replace(/placeholder: "https:\/\/hooks.zapier.com\/hooks\/catch\/\.\.\."/, `defaultValue: "${automation.webhookUrl}", placeholder: "https://hook.make.com/..."`)

      await navigator.clipboard.writeText(code)
      framer.notify(`Custom component "${componentName}" copied! Create a New Component in Framer and paste it in.`)
    } catch (e) {
      framer.notify("Failed to copy component code.")
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-display font-medium text-ink">OmniHook</h1>
            <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-medium rounded-pill">10k+ apps</span>
          </div>
          <p className="text-xs text-body mt-0.5">Automation for Framer</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onNavigate("logs")} className="w-8 h-8 flex items-center justify-center rounded-md text-ink hover:bg-canvas-soft border border-transparent hover:border-mute transition-all transition-colors text-sm" title="Trigger Log">📋</button>
          <button onClick={() => onNavigate("help")} className="w-8 h-8 flex items-center justify-center rounded-md text-ink hover:bg-canvas-soft border border-transparent hover:border-mute transition-all transition-colors text-sm" title="Help">❓</button>
        </div>
      </div>

      {automations.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
          <div className="w-16 h-16 rounded-full bg-canvas-soft flex items-center justify-center mb-4">
            <span className="text-2xl">⚡</span>
          </div>
          <h2 className="text-lg font-display font-medium text-ink mb-1">No automations yet</h2>
          <p className="text-sm text-body mb-6">Connect Framer to Gmail, Slack, Notion & more</p>
          <button onClick={() => onNavigate("create")} className="w-full h-10 bg-primary text-on-primary rounded-md text-sm font-semibold hover:bg-[#e64700] transition-all shadow-sm px-4 py-2">
            + Create Your First Hook
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2 pb-20">
          {activeAutomations.length > 0 && (
            <div>
              <p className="text-xs text-body font-medium mb-1.5 uppercase tracking-wider">Active</p>
              {activeAutomations.map((a) => (
                <HookCard key={a.id} automation={a} onEdit={() => onNavigate("edit", a.id)}
                  onTest={() => onTestAutomation(a)} onToggle={() => onToggleAutomation(a.id)} onDelete={() => onDeleteAutomation(a.id)} onCopy={() => handleCopySpecificComponent(a)} />
              ))}
            </div>
          )}
          {pausedAutomations.length > 0 && (
            <div>
              <p className="text-xs text-body font-medium mb-1.5 uppercase tracking-wider">Paused</p>
              {pausedAutomations.map((a) => (
                <HookCard key={a.id} automation={a} onEdit={() => onNavigate("edit", a.id)}
                  onTest={() => onTestAutomation(a)} onToggle={() => onToggleAutomation(a.id)} onDelete={() => onDeleteAutomation(a.id)} onCopy={() => handleCopySpecificComponent(a)} />
              ))}
            </div>
          )}
          {errorAutomations.length > 0 && (
            <div>
              <p className="text-xs text-body font-medium mb-1.5 uppercase tracking-wider">Error</p>
              {errorAutomations.map((a) => (
                <HookCard key={a.id} automation={a} onEdit={() => onNavigate("edit", a.id)}
                  onTest={() => onTestAutomation(a)} onToggle={() => onToggleAutomation(a.id)} onDelete={() => onDeleteAutomation(a.id)} onCopy={() => handleCopySpecificComponent(a)} />
              ))}
            </div>
          )}
        </div>
      )}

      {automations.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#fffefb] via-[#fffefb] to-transparent">
          <button onClick={() => onNavigate("create")} className="w-full h-10 bg-primary text-on-primary rounded-md text-sm font-semibold hover:bg-[#e64700] transition-all shadow-sm px-4 py-2 shadow-lg">
            + Add Automation
          </button>
        </div>
      )}
    </div>
  )
}
