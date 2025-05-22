
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Check, Bell } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts && toasts.map(function ({ id, title, description, action, variant, ...props }) {
        // Choose icon based on variant
        let ToastIcon = Bell
        if (variant === "destructive") ToastIcon = AlertCircle
        if (variant === "success") ToastIcon = Check
        
        return (
          <Toast key={id} {...props} variant={variant}>
            <div className="flex gap-3 items-start">
              {ToastIcon && <ToastIcon className="h-5 w-5 mt-0.5" />}
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}