
import { Toaster as SonnerToaster } from "sonner";
import { AlertCircle, Check, Bell } from "lucide-react";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        }
      }}
      icons={{
        success: <Check className="h-5 w-5 text-green-500" />,
        error: <AlertCircle className="h-5 w-5 text-red-500" />,
        info: <Bell className="h-5 w-5 text-blue-500" />
      }}
    />
  );
}
