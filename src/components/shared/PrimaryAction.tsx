import type { ComponentType, MouseEventHandler } from 'react'
import { Button } from '@carbon/react'

export interface PrimaryActionProps {
  readonly label: string
  readonly onClick?: MouseEventHandler<HTMLButtonElement>
  readonly icon?: ComponentType
  readonly disabled?: boolean
  readonly loading?: boolean
}

export const PrimaryAction = ({
  label,
  onClick,
  icon,
  disabled = false,
  loading = false,
}: PrimaryActionProps) => {
  return (
    <Button
      kind="primary"
      size="lg"
      onClick={onClick}
      disabled={disabled || loading}
      renderIcon={icon}
    >
      {label}
    </Button>
  )
}

