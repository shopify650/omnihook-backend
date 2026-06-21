import type { PayloadField } from "../types/automation.types"
import { DYNAMIC_VARIABLES } from "../types/automation.types"

interface PayloadBuilderProps {
  fields: PayloadField[]
  onChange: (fields: PayloadField[]) => void
}

export function PayloadBuilder({ fields, onChange }: PayloadBuilderProps) {
  const addField = () => onChange([...fields, { key: "", value: "", type: "static" }])
  const removeField = (index: number) => onChange(fields.filter((_, i) => i !== index))
  const updateField = (index: number, updates: Partial<PayloadField>) =>
    onChange(fields.map((f, i) => (i === index ? { ...f, ...updates } : f)))
  const insertVariable = (index: number, variable: string) => {
    const field = fields[index]
    if (!field) return
    updateField(index, { value: field.value + variable, type: "dynamic" })
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-ink">Data to send to Webhook</label>
        <p className="text-xs text-body mt-0.5">These fields appear in your Hook</p>
      </div>
      <div className="space-y-1 p-3 bg-canvas-soft rounded-md opacity-60">
        <p className="text-xs text-body font-medium">Default fields (always included)</p>
        {[
          { key: "automation_name", value: "[automation name]" },
          { key: "trigger", value: "[trigger type]" },
          { key: "timestamp", value: "[ISO 8601]" },
          { key: "page_url", value: "[current URL]" },
          { key: "page_title", value: "[page title]" },
          { key: "referrer", value: "[referrer URL]" },
        ].map((def) => (
          <div key={def.key} className="flex items-center gap-2 text-xs">
            <span className="text-body">{def.key}:</span>
            <span className="text-body-mid">{def.value}</span>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <label className="block text-xs font-medium text-body">Custom fields</label>
        {fields.map((field, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="flex-1 space-y-1">
              <input type="text" value={field.key} onChange={(e) => updateField(index, { key: e.target.value })}
                placeholder="Field key" className="w-full h-8 px-2 bg-canvas-soft border border-mute rounded-sm text-xs text-ink placeholder-secondary" />
            </div>
            <div className="flex-1 space-y-1">
              <input type="text" value={field.value} onChange={(e) => updateField(index, { value: e.target.value, type: e.target.value.startsWith("{{") ? "dynamic" : "static" })}
                placeholder="Value or {{variable}}" className="w-full h-8 px-2 bg-canvas-soft border border-mute rounded-sm text-xs text-ink placeholder-secondary" />
              <select value="" onChange={(e) => { if (e.target.value) insertVariable(index, e.target.value) }}
                className="w-full h-6 bg-canvas border border-mute rounded-sm text-xs text-body cursor-pointer">
                <option value="">+ Insert variable</option>
                {DYNAMIC_VARIABLES.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <button onClick={() => removeField(index)} className="mt-1 text-body hover:text-error transition-colors text-sm">🗑</button>
          </div>
        ))}
        <button onClick={addField} className="w-full h-8 border border-dashed border-mute rounded-sm text-xs text-body hover:text-ink hover:border-primary transition-colors">
          + Add Field
        </button>
      </div>
      {fields.some((f) => f.key) && (
        <div className="p-3 bg-canvas-soft rounded-md">
          <p className="text-xs text-body mb-1">Preview payload:</p>
          <pre className="text-xs text-ink font-mono whitespace-pre-wrap">
            {"{\n" + fields.filter(f => f.key).map(f => `  "${f.key}": "${f.value}",`).join("\n") + "\n}"}
          </pre>
        </div>
      )}
    </div>
  )
}
