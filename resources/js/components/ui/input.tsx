import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, iconLeft, iconRight, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {iconLeft && (
          <div className="absolute left-3 flex items-center justify-center text-muted-foreground">
            {iconLeft}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-[50px] w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-3 text-sm font-medium text-neutral-900 dark:text-neutral-100 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/20 focus-visible:border-pink-500 transition-colors shadow-sm disabled:cursor-not-allowed disabled:opacity-50",
            iconLeft && "pl-10",
            iconRight && "pr-10",
            className
          )}
          ref={ref}
          {...props}
        />
        {iconRight && (
          <div className="absolute right-3 flex items-center justify-center text-muted-foreground">
            {iconRight}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
