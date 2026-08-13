import './Chip.css'

interface ChipProps {
  label: string
}

function Chip({ label }: ChipProps) {
  return (
    <span className="chip">
      {label}
    </span>
  )
}

export default Chip
