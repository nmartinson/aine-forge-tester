import { useState } from 'react'
import { Bike, BIKES } from './BikeData'
import './BikeSelector.css'

interface BikeSelectorProps {
  onBikeSelected: (bike: Bike) => void
}

function BikeSelector({ onBikeSelected }: BikeSelectorProps) {
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null)

  const handleSelectBike = (bike: Bike) => {
    setSelectedBike(bike)
    onBikeSelected(bike)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hardtail':
        return '#3b82f6'
      case 'full-suspension':
        return '#8b5cf6'
      case 'fat-bike':
        return '#ec4899'
      case 'downhill':
        return '#f59e0b'
      default:
        return '#6b7280'
    }
  }

  return (
    <div className="bike-selector-container">
      <div className="bike-selector-content">
        <h2>Choose Your Bike</h2>
        <p className="bike-subtitle">Select the perfect bike for your trail adventure!</p>

        <div className="bikes-grid">
          {BIKES.map((bike) => (
            <div
              key={bike.id}
              className={`bike-card ${selectedBike?.id === bike.id ? 'selected' : ''}`}
              style={{ borderTopColor: getTypeColor(bike.type) }}
              onClick={() => handleSelectBike(bike)}
            >
              <div className="bike-emoji">{bike.emoji}</div>
              <div className="bike-header">
                <h3>{bike.name}</h3>
                <span
                  className="type-badge"
                  style={{ backgroundColor: getTypeColor(bike.type) }}
                >
                  {bike.type.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              <div className="bike-specs">
                <div className="spec">
                  <span className="spec-label">Weight:</span>
                  <span className="spec-value">{bike.weight} kg</span>
                </div>
                <div className="spec">
                  <span className="spec-label">Suspension:</span>
                  <span className="spec-value">{bike.suspension}</span>
                </div>
              </div>

              <div className="bike-stats">
                <div className="stat-row">
                  <span className="stat-name">Traction</span>
                  <div className="stat-bar">
                    <div
                      className="stat-fill"
                      style={{
                        width: `${bike.traction}%`,
                        backgroundColor: getTypeColor(bike.type),
                      }}
                    ></div>
                  </div>
                  <span className="stat-number">{bike.traction}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-name">Speed</span>
                  <div className="stat-bar">
                    <div
                      className="stat-fill"
                      style={{
                        width: `${bike.speed}%`,
                        backgroundColor: getTypeColor(bike.type),
                      }}
                    ></div>
                  </div>
                  <span className="stat-number">{bike.speed}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-name">Durability</span>
                  <div className="stat-bar">
                    <div
                      className="stat-fill"
                      style={{
                        width: `${bike.durability}%`,
                        backgroundColor: getTypeColor(bike.type),
                      }}
                    ></div>
                  </div>
                  <span className="stat-number">{bike.durability}</span>
                </div>
              </div>

              <p className="bike-description">{bike.description}</p>

              <button
                className="select-bike-btn"
                style={{ backgroundColor: getTypeColor(bike.type) }}
              >
                {selectedBike?.id === bike.id ? '✓ Selected' : 'Select Bike'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BikeSelector
