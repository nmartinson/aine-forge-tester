import './Badge.css'

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'secondary'
type BadgeSize = 'small' | 'medium' | 'large'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
  size?: BadgeSize
  className?: string
}

function Badge({ label, variant = 'default', size = 'medium', className = '' }: BadgeProps) {
  const badgeClassName = `badge badge-${variant} badge-${size} ${className}`.trim()

  return (
    <span className={badgeClassName}>
      {label}
    </span>
  )
}

export default Badge
