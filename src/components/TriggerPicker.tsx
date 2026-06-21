import type { TriggerType, TriggerConfig } from "../types/automation.types"
import { TRIGGER_DISPLAY, TRIGGER_TYPES } from "../types/automation.types"
import { TriggerIcon } from "./TriggerIcon"

interface TriggerPickerProps {
  selected: TriggerType
  config: TriggerConfig
  onSelect: (trigger: TriggerType) => void
  onConfigChange: (config: TriggerConfig) => void
}

export function TriggerPicker({ selected, config, onSelect, onConfigChange }: TriggerPickerProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-ink">What fires this automation?</label>
      <div className="grid grid-cols-2 gap-2">
        {TRIGGER_TYPES.map((type) => {
          const display = TRIGGER_DISPLAY[type]
          const isSelected = selected === type
          return (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className={`flex flex-col items-center gap-1 p-3 rounded-md border text-sm transition-all ${
                isSelected ? "border-primary bg-primary/10 ring-1 ring-accent" : "border-mute bg-canvas-soft hover:border-secondary"
              }`}
            >
              <TriggerIcon type={type} className={`w-6 h-6 mb-1 ${isSelected ? "text-primary" : "text-ink"}`} />
              <span className={`text-xs font-medium ${isSelected ? "text-ink" : "text-body"}`}>{display.label}</span>
            </button>
          )
        })}
      </div>
      {selected && <TriggerConfigPanel trigger={selected} config={config} onChange={onConfigChange} />}
    </div>
  )
}

interface TriggerConfigPanelProps {
  trigger: TriggerType
  config: TriggerConfig
  onChange: (config: TriggerConfig) => void
}

function TriggerConfigPanel({ trigger, config, onChange }: TriggerConfigPanelProps) {
  const update = (partial: Partial<TriggerConfig>) => onChange({ ...config, ...partial })

  switch (trigger) {
    case "form_submit":
      return (
        <div className="space-y-2 p-3 bg-canvas-soft rounded-md">
          <label className="block text-xs text-body">Form Selector</label>
          <input type="text" value={config.formSelector ?? "any"} onChange={(e) => update({ formSelector: e.target.value })}
            placeholder="any" className="w-full h-8 px-2 bg-canvas border border-mute rounded-sm text-xs text-ink placeholder-secondary" />
          <label className="block text-xs text-body">Capture these fields</label>
          <div className="flex flex-wrap gap-2">
            {["email", "name", "phone", "message"].map((field) => (
              <label key={field} className="flex items-center gap-1 text-xs text-ink cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-accent" /> {field}
              </label>
            ))}
          </div>
        </div>
      )
    case "button_click":
      return (
        <div className="space-y-2 p-3 bg-canvas-soft rounded-md">
          <label className="block text-xs text-body">Button Selector (CSS)</label>
          <input type="text" value={config.buttonSelector ?? "any"} onChange={(e) => update({ buttonSelector: e.target.value })}
            placeholder="any" className="w-full h-8 px-2 bg-canvas border border-mute rounded-sm text-xs text-ink placeholder-secondary" />
          <label className="block text-xs text-body">Or match button text</label>
          <input type="text" value={config.buttonText ?? ""} onChange={(e) => update({ buttonText: e.target.value })}
            placeholder="e.g. Submit" className="w-full h-8 px-2 bg-canvas border border-mute rounded-sm text-xs text-ink placeholder-secondary" />
        </div>
      )
    case "page_view":
      return (
        <div className="space-y-2 p-3 bg-canvas-soft rounded-md">
          <label className="block text-xs text-body">Page URL filter</label>
          <input type="text" value={config.pageUrl ?? "*"} onChange={(e) => update({ pageUrl: e.target.value })}
            placeholder="* for all pages" className="w-full h-8 px-2 bg-canvas border border-mute rounded-sm text-xs text-ink placeholder-secondary" />
          <label className="block text-xs text-body">Delay (ms)</label>
          <input type="number" value={config.delayMs ?? 0} onChange={(e) => update({ delayMs: Number(e.target.value) })}
            min={0} max={10000} className="w-full h-8 px-2 bg-canvas border border-mute rounded-sm text-xs text-ink" />
        </div>
      )
    case "scroll_depth":
      return (
        <div className="space-y-2 p-3 bg-canvas-soft rounded-md">
          <label className="block text-xs text-body">Fire when user scrolls to:</label>
          <div className="flex gap-2">
            {([25, 50, 75, 100] as const).map((pct) => (
              <button key={pct} onClick={() => update({ scrollPercent: pct })}
                className={`flex-1 h-8 rounded-sm text-xs font-medium transition-colors ${
                  (config.scrollPercent ?? 50) === pct ? "bg-primary text-on-primary" : "bg-canvas border border-mute text-body hover:border-primary"
                }`}>{pct}%</button>
            ))}
          </div>
        </div>
      )
    case "time_on_page":
      return (
        <div className="space-y-2 p-3 bg-canvas-soft rounded-md">
          <label className="block text-xs text-body">Fire after X seconds</label>
          <input type="number" value={config.secondsOnPage ?? 30} onChange={(e) => update({ secondsOnPage: Number(e.target.value) })}
            min={5} max={300} className="w-full h-8 px-2 bg-canvas border border-mute rounded-sm text-xs text-ink" />
          <p className="text-xs text-body">Min: 5s, Max: 300s</p>
        </div>
      )
    case "exit_intent":
      return (
        <div className="p-3 bg-canvas-soft rounded-md">
          <p className="text-xs text-body">Fires when the user moves their cursor to close the tab/window. No configuration needed.</p>
        </div>
      )
    case "cms_item_view":
      return (
        <div className="p-3 bg-canvas-soft rounded-md">
          <p className="text-xs text-body">Fires when a CMS item page is viewed. No additional configuration needed.</p>
        </div>
      )
    case "custom_event":
      return (
        <div className="space-y-2 p-3 bg-canvas-soft rounded-md">
          <label className="block text-xs text-body">Custom Event Name</label>
          <input type="text" value={config.eventName ?? ""} onChange={(e) => update({ eventName: e.target.value })}
            placeholder="my-custom-event" className="w-full h-8 px-2 bg-canvas border border-mute rounded-sm text-xs text-ink placeholder-secondary" />
          <p className="text-xs text-body">Fire using: window.dispatchEvent(new Event('{config.eventName || "your-event-name"}'))</p>
        </div>
      )
    default:
      return null
  }
}
