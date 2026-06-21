export type TriggerType =
  | "form_submit"
  | "button_click"
  | "page_view"
  | "scroll_depth"
  | "cms_item_view"
  | "custom_event"
  | "time_on_page"
  | "exit_intent"

export type AutomationStatus = "active" | "paused" | "error"

export interface PayloadField {
  key: string
  value: string
  type: "static" | "dynamic"
}

export interface TriggerConfig {
  formSelector?: string
  formFields?: string[]
  buttonSelector?: string
  buttonText?: string
  pageUrl?: string
  delayMs?: number
  scrollPercent?: 25 | 50 | 75 | 100
  secondsOnPage?: number
  eventName?: string
}

export interface TestResult {
  success: boolean
  statusCode: number
  responseTime: number
  error?: string
  testedAt: string
}

export interface Automation {
  id: string
  name: string
  description: string
  trigger: TriggerType
  triggerConfig: TriggerConfig
  webhookUrl: string
  payload: PayloadField[]
  status: AutomationStatus
  createdAt: string
  updatedAt: string
  lastFiredAt: string | null
  fireCount: number
  testResult: TestResult | null
}

export interface TriggerLog {
  id: string
  automationId: string
  automationName: string
  firedAt: string
  payload: Record<string, unknown>
  status: "success" | "failed"
  statusCode?: number
  error?: string
  webhookUrl: string
  responseTime: number
}

export interface TriggerContext {
  pageUrl: string
  pageTitle: string
  pagePath: string
  referrer: string
  formData?: Record<string, string>
  scrollPercent?: number
  timeOnPage?: number
  cmsItemId?: string
  cmsItemTitle?: string
}

export type Screen = "home" | "create" | "edit" | "test" | "logs" | "help"

export const DYNAMIC_VARIABLES = [
  "{{page.url}}",
  "{{page.title}}",
  "{{page.path}}",
  "{{user.timestamp}}",
  "{{user.timezone}}",
  "{{user.referrer}}",
  "{{user.language}}",
  "{{form.email}}",
  "{{form.name}}",
  "{{form.phone}}",
  "{{form.message}}",
  "{{form.all}}",
  "{{scroll.percent}}",
  "{{time.on_page}}",
  "{{cms.item_id}}",
  "{{cms.item_title}}",
] as const

export type DynamicVariable = (typeof DYNAMIC_VARIABLES)[number]

export const TRIGGER_DISPLAY: Record<TriggerType, { label: string; icon: string; description: string }> = {
  form_submit: { label: "Form Submit", icon: "📝", description: "User submits a form" },
  button_click: { label: "Button Click", icon: "🖱️", description: "User clicks a button" },
  page_view: { label: "Page View", icon: "👁️", description: "Page is loaded" },
  scroll_depth: { label: "Scroll Depth", icon: "📊", description: "User scrolls to a depth" },
  cms_item_view: { label: "CMS Item View", icon: "📄", description: "CMS item page is viewed" },
  custom_event: { label: "Custom Event", icon: "⚡", description: "Developer fires a custom event" },
  time_on_page: { label: "Time on Page", icon: "⏱️", description: "User spends X seconds" },
  exit_intent: { label: "Exit Intent", icon: "🚪", description: "User moves to close tab" },
}

export const TRIGGER_TYPES: TriggerType[] = [
  "form_submit",
  "button_click",
  "page_view",
  "scroll_depth",
  "time_on_page",
  "exit_intent",
  "cms_item_view",
  "custom_event",
]
