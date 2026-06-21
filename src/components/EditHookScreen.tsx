import { useState, useEffect } from "react"
import type { Automation, TriggerType, TriggerConfig, PayloadField, Screen } from "../types/automation.types"
import { TriggerPicker } from "./TriggerPicker"
import { WebhookInput } from "./WebhookInput"
import { PayloadBuilder } from "./PayloadBuilder"

interface EditHookScreenProps {
  automations: Automation[]
  editId: string | null
  onBack: () => void
  onUpdate: (id: string, updates: Partial<Automation>) => void
  onNavigate: (screen: Screen, automationId?: string) => void
}

export function EditHookScreen({ automations, editId, onBack, onUpdate, onNavigate }: EditHookScreenProps) {
  const automation = automations.find((a) => a.id === editId)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [trigger, setTrigger] = useState<TriggerType>("form_submit")
  const [triggerConfig, setTriggerConfig] = useState<TriggerConfig>({})
  const [webhookUrl, setWebhookUrl] = useState("")
  const [payload, setPayload] = useState<PayloadField[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!automation) return
    setName(automation.name)
    setDescription(automation.description)
    setTrigger(automation.trigger)
    setTriggerConfig(automation.triggerConfig)
    setWebhookUrl(automation.webhookUrl)
    setPayload(automation.payload)
  }, [automation])

  if (!automation) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="text-body text-sm">Automation not found</p>
        <button onClick={onBack} className="mt-4 text-primary text-sm hover:underline">Go back</button>
      </div>
    )
  }

  const handleSave = () => {
    if (!name.trim() || !webhookUrl.trim()) return
    setSaving(true)
    onUpdate(automation.id, { name: name.trim(), description: description.trim(), trigger, triggerConfig, webhookUrl: webhookUrl.trim(), payload })
    setSaving(false)
    onNavigate("home")
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-md text-ink hover:bg-canvas-soft border border-transparent hover:border-mute transition-all transition-colors text-sm">←</button>
        <h2 className="text-base font-bold text-ink">Edit Automation</h2>
      </div>
      <div className="flex-1 overflow-y-auto space-y-5 pr-1">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-ink">Automation Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. New Lead to Slack"
            className="w-full h-9 px-3 bg-canvas-soft border border-mute rounded-sm text-sm text-ink placeholder-secondary outline-none focus:border-primary" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-ink">Description (optional)</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What does this do?" rows={2}
            className="w-full px-3 py-2 bg-canvas-soft border border-mute rounded-sm text-sm text-ink placeholder-secondary outline-none resize-none focus:border-primary" />
        </div>
        <TriggerPicker selected={trigger} config={triggerConfig} onSelect={setTrigger} onConfigChange={setTriggerConfig} />
        <WebhookInput value={webhookUrl} onChange={setWebhookUrl} onHelp={() => onNavigate("help")} />
        <PayloadBuilder fields={payload} onChange={setPayload} />
      </div>
      <div className="flex gap-2 pt-4 border-t border-mute mt-4">
        <button onClick={onBack} className="flex-1 h-10 bg-canvas-soft border border-mute rounded-md text-sm text-ink font-medium hover:bg-border transition-colors">Cancel</button>
        <button onClick={handleSave} disabled={!name.trim() || !webhookUrl.trim() || saving}
          className="flex-1 h-10 bg-primary text-on-primary rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  )
}
