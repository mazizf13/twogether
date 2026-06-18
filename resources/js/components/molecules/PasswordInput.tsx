import React, { useState } from 'react'
import { Input, InputProps } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'iconRight'> {}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    const eyeIcon = (
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="focus:outline-none hover:text-foreground text-muted-foreground transition-colors"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <Eye className="w-5 h-5" />
        ) : (
          <EyeOff className="w-5 h-5" />
        )}
      </button>
    )

    return (
      <Input
        type={showPassword ? 'text' : 'password'}
        iconRight={eyeIcon}
        ref={ref}
        {...props}
      />
    )
  }
)

PasswordInput.displayName = 'PasswordInput'

