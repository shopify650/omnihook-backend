import type { PayloadField } from "../types/automation.types"

export function createDefaultPayload(): PayloadField[] {
  return []
}

export function addPayloadField(fields: PayloadField[]): PayloadField[] {
  return [...fields, { key: "", value: "", type: "static" }]
}

export function removePayloadField(fields: PayloadField[], index: number): PayloadField[] {
  return fields.filter((_, i) => i !== index)
}

export function updatePayloadField(fields: PayloadField[], index: number, updates: Partial<PayloadField>): PayloadField[] {
  return fields.map((field, i) => (i === index ? { ...field, ...updates } : field))
}

export function getPayloadPreviewHtml(fields: PayloadField[]): string {
  if (fields.length === 0) return "{}"
  const lines: string[] = ["{"]
  for (const field of fields) {
    if (!field.key) continue
    lines.push(`  "${field.key}": "${field.value}",`)
  }
  lines.push("}")
  return lines.join("\n")
}
