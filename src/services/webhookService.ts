import type { Automation, TriggerContext } from "../types/automation.types"

export interface WebhookPayload {
  automation_id: string
  automation_name: string
  trigger: string
  timestamp: string
  page_url: string
  page_title: string
  referrer: string
  [key: string]: unknown
}

export interface WebhookFireResult {
  success: boolean
  statusCode: number
  responseTime: number
  error?: string
}

export function isValidWebhookUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === "https:" || parsed.protocol === "http:"
  } catch {
    return false
  }
}

export function getWebhookPlatform(url: string): string {
  try {
    const hostname = new URL(url).hostname
    if (hostname.includes("zapier.com")) return "Zapier"
    if (hostname.includes("make.com")) return "Make.com"
    if (hostname.includes("pipedream.net")) return "Pipedream"
    if (hostname.includes("webhook.site")) return "Webhook.site"
    if (hostname.includes("n8n")) return "n8n"
    return "Custom Webhook"
  } catch {
    return "Webhook"
  }
}

export async function fireWebhook(
  webhookUrl: string,
  payload: WebhookPayload,
  timeoutMs: number = 10000
): Promise<WebhookFireResult> {
  const startTime = Date.now()

  try {
    if (!isValidWebhookUrl(webhookUrl)) {
      return {
        success: false,
        error: "Invalid webhook URL format",
        responseTime: 0,
        statusCode: 0,
      }
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    const response = await fetch(webhookUrl, {
      method: "POST",
      mode: "no-cors",
      // Remove Content-Type header so it defaults to text/plain, bypassing CORS preflight
      // Zapier automatically parses JSON even if sent as text/plain
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    const responseTime = Date.now() - startTime

    // no-cors mode returns an "opaque" response where status is 0 and ok is false.
    // As long as no exception was thrown, the request actually succeeded.
    return {
      success: true,
      statusCode: 200,
      responseTime,
      error: undefined,
    }
  } catch (error: unknown) {
    const responseTime = Date.now() - startTime
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return {
          success: false,
          error: "Webhook timed out after 10 seconds",
          responseTime,
          statusCode: 0,
        }
      }
      return {
        success: false,
        error: error.message,
        responseTime,
        statusCode: 0,
      }
    }
    return {
      success: false,
      error: "Unknown error occurred",
      responseTime,
      statusCode: 0,
    }
  }
}

export function buildPayload(automation: Automation, context: TriggerContext): WebhookPayload {
  const basePayload: WebhookPayload = {
    automation_id: automation.id,
    automation_name: automation.name,
    trigger: automation.trigger,
    timestamp: new Date().toISOString(),
    page_url: context.pageUrl,
    page_title: context.pageTitle,
    referrer: context.referrer,
    user_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    user_language: navigator.language,
  }

  for (const field of automation.payload) {
    basePayload[field.key] = resolveDynamicValue(field.value, context)
  }

  return basePayload
}

export function resolveDynamicValue(value: string, context: TriggerContext): unknown {
  const replacements: Record<string, unknown> = {
    "{{page.url}}": context.pageUrl,
    "{{page.title}}": context.pageTitle,
    "{{page.path}}": context.pagePath,
    "{{user.timestamp}}": new Date().toISOString(),
    "{{user.timezone}}": Intl.DateTimeFormat().resolvedOptions().timeZone,
    "{{user.referrer}}": context.referrer,
    "{{user.language}}": navigator.language,
    "{{form.email}}": context.formData?.email ?? "",
    "{{form.name}}": context.formData?.name ?? "",
    "{{form.phone}}": context.formData?.phone ?? "",
    "{{form.message}}": context.formData?.message ?? "",
    "{{form.all}}": context.formData ?? {},
    "{{scroll.percent}}": context.scrollPercent ?? 0,
    "{{time.on_page}}": context.timeOnPage ?? 0,
    "{{cms.item_id}}": context.cmsItemId ?? "",
    "{{cms.item_title}}": context.cmsItemTitle ?? "",
  }

  if (value in replacements) {
    return replacements[value]
  }

  let result = value
  for (const [variable, replacement] of Object.entries(replacements)) {
    result = result.replace(variable, String(replacement))
  }
  return result
}
