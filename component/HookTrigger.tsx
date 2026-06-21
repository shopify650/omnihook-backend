import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { useEffect, useRef } from "react"

type TriggerType =
  | "page_view"
  | "form_submit"
  | "button_click"
  | "scroll_depth"
  | "time_on_page"
  | "exit_intent"
  | "custom_event"

interface Props {
  webhookUrl: string
  triggerType: TriggerType
  formSelector: string
  buttonSelector: string
  scrollPercent: number
  pageUrl: string
  delayMs: number
  timeOnPage: number
  customEventName: string
  customPayload: string
  enabled: boolean
  debugMode: boolean
}

export default function HookTrigger(props: Props) {
  const firedRef = useRef(false)

  useEffect(() => {
    if (!props.enabled || !props.webhookUrl || typeof window === "undefined") return

    const fire = async (extraData: Record<string, unknown> = {}) => {
      if (!props.webhookUrl.startsWith("http")) {
        if (props.debugMode) console.warn("HookTrigger: Invalid webhook URL")
        return
      }
      let extra: Record<string, unknown> = {}
      try { if (props.customPayload) extra = JSON.parse(props.customPayload) }
      catch { if (props.debugMode) console.warn("HookTrigger: Invalid customPayload JSON") }

      const payload: Record<string, unknown> = {
        trigger: props.triggerType,
        timestamp: new Date().toISOString(),
        page_url: window.location.href,
        page_title: document.title,
        page_path: window.location.pathname,
        referrer: document.referrer,
        user_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        user_language: navigator.language,
        ...extra,
        ...extraData,
      }

      if (props.debugMode) console.log("HookTrigger firing:", payload)
      try {
        await fetch(props.webhookUrl, {
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify(payload),
        })
        if (props.debugMode) console.log("HookTrigger: Webhook sent!")
      } catch (err) {
        if (props.debugMode) console.error("HookTrigger: Failed to send", err)
      }
    }

    if (props.triggerType === "page_view") {
      if (props.pageUrl === "*" || window.location.href.includes(props.pageUrl)) {
        const timer = setTimeout(() => fire(), props.delayMs || 0)
        return () => clearTimeout(timer)
      }
    }

    if (props.triggerType === "form_submit") {
      const selector = props.formSelector || "form"
      const handleSubmit = (e: Event) => {
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        const fields: Record<string, string> = {}
        formData.forEach((val, key) => { fields[key] = String(val) })
        fire({ form_data: fields, form_id: form.id || "unknown", email: fields.email || fields.Email || "" })
      }
      const forms = selector === "any" ? document.querySelectorAll("form") : document.querySelectorAll(selector)
      forms.forEach((f) => f.addEventListener("submit", handleSubmit))
      return () => { forms.forEach((f) => f.removeEventListener("submit", handleSubmit)) }
    }

    if (props.triggerType === "button_click") {
      const handleClick = (e: MouseEvent) => {
        const el = e.target as HTMLElement
        const btn = el.tagName === "BUTTON" ? el : el.closest("button") ?? el.closest("[role='button']")
        if (!btn) return
        if (props.buttonSelector && props.buttonSelector !== "any" && !btn.matches(props.buttonSelector)) return
        fire({ button_text: btn.textContent?.trim() ?? "", button_id: (btn as HTMLElement).id || "unknown" })
      }
      document.addEventListener("click", handleClick)
      return () => document.removeEventListener("click", handleClick)
    }

    if (props.triggerType === "scroll_depth") {
      firedRef.current = false
      const threshold = (props.scrollPercent || 50) / 100
      let ticking = false
      const handleScroll = () => {
        if (firedRef.current || ticking) return
        ticking = true
        window.requestAnimationFrame(() => {
          const percent = (window.scrollY + window.innerHeight) / document.body.scrollHeight
          if (percent >= threshold) { firedRef.current = true; fire({ scroll_percent: props.scrollPercent }) }
          ticking = false
        })
      }
      window.addEventListener("scroll", handleScroll, { passive: true })
      return () => window.removeEventListener("scroll", handleScroll)
    }

    if (props.triggerType === "time_on_page") {
      const seconds = props.timeOnPage || 30
      const startTime = Date.now()
      const timer = setTimeout(() => fire({ seconds_on_page: seconds, actual_time_ms: Date.now() - startTime }), seconds * 1000)
      return () => clearTimeout(timer)
    }

    if (props.triggerType === "exit_intent") {
      firedRef.current = false
      const handleMouseLeave = (e: MouseEvent) => {
        if (firedRef.current) return
        if (e.clientY <= 0) { firedRef.current = true; fire({ exit_type: "mouse_leave_top" }) }
      }
      document.addEventListener("mouseleave", handleMouseLeave)
      return () => document.removeEventListener("mouseleave", handleMouseLeave)
    }

    if (props.triggerType === "custom_event") {
      if (!props.customEventName) return
      const handleCustom = (e: Event) => {
        const detail = e instanceof CustomEvent ? e.detail : {}
        fire({ custom_event_name: props.customEventName, ...detail })
      }
      window.addEventListener(props.customEventName, handleCustom)
      return () => window.removeEventListener(props.customEventName, handleCustom)
    }
  }, [props.enabled, props.webhookUrl, props.triggerType, props.formSelector, props.buttonSelector,
      props.scrollPercent, props.pageUrl, props.delayMs, props.timeOnPage, props.customEventName,
      props.customPayload, props.debugMode])

  const isCanvas = RenderTarget.current() === RenderTarget.canvas

  if (isCanvas) {
    return (
      <div style={{
        width: "100%", height: "100%", minHeight: 40, minWidth: 40,
        background: "rgba(255, 79, 0, 0.1)", border: "1px dashed #ff4f00",
        borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
        color: "#ff4f00", fontSize: 12, fontWeight: 600, fontFamily: "sans-serif"
      }}>
        ⚡ HookTrigger
      </div>
    )
  }

  return null
}

addPropertyControls(HookTrigger, {
  webhookUrl: { type: ControlType.String, title: "Webhook URL", placeholder: "https://hooks.zapier.com/hooks/catch/...", displayTextArea: false },
  triggerType: {
    type: ControlType.Enum, title: "Trigger",
    options: ["page_view", "form_submit", "button_click", "scroll_depth", "time_on_page", "exit_intent", "custom_event"],
    optionTitles: ["Page View", "Form Submit", "Button Click", "Scroll Depth", "Time on Page", "Exit Intent", "Custom Event"],
    defaultValue: "page_view",
  },
  enabled: { type: ControlType.Boolean, title: "Enabled", defaultValue: true },
  formSelector: { type: ControlType.String, title: "Form Selector", defaultValue: "any", hidden: (props: any) => props.triggerType !== "form_submit" },
  buttonSelector: { type: ControlType.String, title: "Button Selector", defaultValue: "any", hidden: (props: any) => props.triggerType !== "button_click" },
  scrollPercent: {
    type: ControlType.Enum, title: "Scroll %", options: [25, 50, 75, 100], optionTitles: ["25%", "50%", "75%", "100%"],
    defaultValue: 50, hidden: (props: any) => props.triggerType !== "scroll_depth",
  },
  timeOnPage: { type: ControlType.Number, title: "Seconds", defaultValue: 30, min: 5, max: 300, hidden: (props: any) => props.triggerType !== "time_on_page" },
  customEventName: { type: ControlType.String, title: "Event Name", placeholder: "my-custom-event", hidden: (props: any) => props.triggerType !== "custom_event" },
  pageUrl: { type: ControlType.String, title: "Page URL Filter", defaultValue: "*", hidden: (props: any) => props.triggerType !== "page_view" },
  delayMs: { type: ControlType.Number, title: "Delay (ms)", defaultValue: 0, min: 0, max: 10000, hidden: (props: any) => props.triggerType !== "page_view" },
  customPayload: { type: ControlType.String, title: "Extra Payload (JSON)", placeholder: '{"source": "framer"}', displayTextArea: true },
  debugMode: { type: ControlType.Boolean, title: "Debug Mode", defaultValue: false },
})
