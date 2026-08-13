import './Chip.css'

interface ChipProps {
  label: string
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
  size?: 'small' | 'medium' | 'large'
  onDelete?: () => void
  icon?: string
}

function Chip({
  label,
  variant = 'default',
  size = 'medium',
  onDelete,
  icon,
}: ChipProps) {
  return (
    <div className={`chip chip-${variant} chip-${size}`}>
      {icon && <span className="chip-icon">{icon}</span>}
      <span className="chip-label">{label}</span>
      {onDelete && (
        <button
          className="chip-delete"
          onClick={onDelete}
          aria-label={`Remove ${label}`}
          type="button"
        >
          ×
        </button>
      )}
    </div>
  )
}

export default Chip
