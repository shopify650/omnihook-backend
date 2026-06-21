import { useEffect } from "react"

export interface ToastData {
  message: string
  type: "success" | "error" | "info"
}

interface ToastProps {
  toast: ToastData | null
  onDismiss: () => void
}

export function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(onDismiss, 3000)
    return () => clearTimeout(timer)
  }, [toast, onDismiss])

  if (!toast) return null

  const bgColor =
    toast.type === "success" ? "bg-success" :
    toast.type === "error" ? "bg-error" : "bg-primaryblue"

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <div className={`${bgColor} text-ink px-4 py-3 rounded-md text-sm font-medium shadow-lg`}>
        {toast.message}
      </div>
    </div>
  )
}
