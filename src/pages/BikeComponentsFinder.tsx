import { useState } from 'react'
import './BikeComponentsFinder.css'

interface Component {
  id: number
  name: string
  category: 'drivetrain' | 'brakes' | 'wheels' | 'suspension' | 'handlebars' | 'seat'
  bikeType: 'hardtail' | 'full-suspension' | 'fat-bike' | 'downhill' | 'all'
  price: number
  weight: number
  performance: number
  description: string
  emoji: string
}

const COMPONENTS: Component[] = [
  // Drivetrain
  {
    id: 1,
    name: 'Shimano XT 12-Speed',
    category: 'drivetrain',
    bikeType: 'all',
    price: 450,
    weight: 0.8,
    performance: 85,
    description: 'Reliable and smooth shifting for all terrain types.',
    emoji: '⚙️',
  },
  {
    id: 2,
    name: 'SRAM Eagle 12-Speed',
    category: 'drivetrain',
    bikeType: 'all',
    price: 500,
    weight: 0.75,
    performance: 90,
    description: 'Ultra-wide range for extreme climbing and descending.',
    emoji: '⚙️',
  },
  {
    id: 3,
    name: 'Microshift Advent 10-Speed',
    category: 'drivetrain',
    bikeType: 'hardtail',
    price: 200,
    weight: 1.0,
    performance: 70,
    description: 'Budget-friendly option with solid performance.',
    emoji: '⚙️',
  },
  // Brakes
  {
    id: 4,
    name: 'Shimano XT Hydraulic Disc',
    category: 'brakes',
    bikeType: 'all',
    price: 350,
    weight: 0.4,
    performance: 88,
    description: 'Powerful and modular hydraulic brakes for all conditions.',
    emoji: '🛑',
  },
  {
    id: 5,
    name: 'SRAM Guide RE',
    category: 'brakes',
    bikeType: 'all',
    price: 400,
    weight: 0.38,
    performance: 92,
    description: 'Premium brakes with excellent modulation and power.',
    emoji: '🛑',
  },
  {
    id: 6,
    name: 'Tektro Aquila Mechanical',
    category: 'brakes',
    bikeType: 'hardtail',
    price: 120,
    weight: 0.5,
    performance: 65,
    description: 'Affordable mechanical brakes for casual riding.',
    emoji: '🛑',
  },
  // Wheels
  {
    id: 7,
    name: 'DT Swiss M1700 29"',
    category: 'wheels',
    bikeType: 'hardtail',
    price: 600,
    weight: 1.8,
    performance: 85,
    description: 'Lightweight and durable wheels for trail riding.',
    emoji: '🛞',
  },
  {
    id: 8,
    name: 'Mavic Crossmax 29"',
    category: 'wheels',
    bikeType: 'full-suspension',
    price: 800,
    weight: 1.7,
    performance: 90,
    description: 'Premium wheels with excellent impact resistance.',
    emoji: '🛞',
  },
  {
    id: 9,
    name: 'Surly Rabbit Hole 26"',
    category: 'wheels',
    bikeType: 'fat-bike',
    price: 700,
    weight: 2.2,
    performance: 88,
    description: 'Wide rims designed for fat bike tires.',
    emoji: '🛞',
  },
  // Suspension
  {
    id: 10,
    name: 'RockShox Judy Gold',
    category: 'suspension',
    bikeType: 'hardtail',
    price: 400,
    weight: 1.9,
    performance: 82,
    description: 'Reliable front suspension for trail riding.',
    emoji: '🌀',
  },
  {
    id: 11,
    name: 'Fox 36 Factory',
    category: 'suspension',
    bikeType: 'downhill',
    price: 1200,
    weight: 2.1,
    performance: 95,
    description: 'Premium downhill fork with adjustable damping.',
    emoji: '🌀',
  },
  {
    id: 12,
    name: 'RockShox Super Deluxe',
    category: 'suspension',
    bikeType: 'full-suspension',
    price: 800,
    weight: 2.3,
    performance: 90,
    description: 'High-performance rear shock for full suspension bikes.',
    emoji: '🌀',
  },
  // Handlebars
  {
    id: 13,
    name: 'Renthal Fatbar Lite',
    category: 'handlebars',
    bikeType: 'all',
    price: 150,
    weight: 0.25,
    performance: 80,
    description: 'Lightweight aluminum bars with excellent control.',
    emoji: '🎯',
  },
  {
    id: 14,
    name: 'Deity Blacklabel',
    category: 'handlebars',
    bikeType: 'downhill',
    price: 200,
    weight: 0.3,
    performance: 88,
    description: 'Wide bars for maximum control on steep terrain.',
    emoji: '🎯',
  },
  // Seat
  {
    id: 15,
    name: 'Selle Italia SLR',
    category: 'seat',
    bikeType: 'all',
    price: 250,
    weight: 0.15,
    performance: 85,
    description: 'Lightweight and comfortable for long rides.',
    emoji: '🪑',
  },
  {
    id: 16,
    name: 'WTB Volt',
    category: 'seat',
    bikeType: 'all',
    price: 180,
    weight: 0.2,
    performance: 80,
    description: 'Durable and supportive for trail riding.',
    emoji: '🪑',
  },
]

function BikeComponentsFinder() {
  const [selectedBikeType, setSelectedBikeType] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedComponents, setSelectedComponents] = useState<Component[]>([])
  const [sortBy, setSortBy] = useState<'price' | 'performance' | 'weight'>('performance')

  const bikeTypes = [
    { value: 'all', label: 'All Bikes' },
    { value: 'hardtail', label: 'Hardtail' },
    { value: 'full-suspension', label: 'Full Suspension' },
    { value: 'fat-bike', label: 'Fat Bike' },
    { value: 'downhill', label: 'Downhill' },
  ]

  const categories = [
    { value: 'all', label: 'All Components' },
    { value: 'drivetrain', label: 'Drivetrain' },
    { value: 'brakes', label: 'Brakes' },
    { value: 'wheels', label: 'Wheels' },
    { value: 'suspension', label: 'Suspension' },
    { value: 'handlebars', label: 'Handlebars' },
    { value: 'seat', label: 'Seat' },
  ]

  const filteredComponents = COMPONENTS.filter((comp) => {
    const bikeMatch = selectedBikeType === 'all' || comp.bikeType === 'all' || comp.bikeType === selectedBikeType
    const categoryMatch = selectedCategory === 'all' || comp.category === selectedCategory
    return bikeMatch && categoryMatch
  }).sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price
    if (sortBy === 'performance') return b.performance - a.performance
    return a.weight - b.weight
  })

  const toggleComponent = (component: Component) => {
    const isSelected = selectedComponents.some((c) => c.id === component.id)
    if (isSelected) {
      setSelectedComponents(selectedComponents.filter((c) => c.id !== component.id))
    } else {
      setSelectedComponents([...selectedComponents, component])
    }
  }

  const totalPrice = selectedComponents.reduce((sum, c) => sum + c.price, 0)
  const totalWeight = selectedComponents.reduce((sum, c) => sum + c.weight, 0)
  const avgPerformance = selectedComponents.length > 0
    ? Math.round(selectedComponents.reduce((sum, c) => sum + c.performance, 0) / selectedComponents.length)
    : 0

  const clearSelection = () => {
    setSelectedComponents([])
  }

  return (
    <div className="finder-container">
      <div className="finder-content">
        <h1>🔧 Mountain Bike Components Finder</h1>
        <p className="subtitle">Find the perfect components for your mountain bike setup</p>

        <div className="finder-layout">
          {/* Filters */}
          <div className="filters-panel">
            <h2>Filters</h2>

            <div className="filter-group">
              <label>Bike Type</label>
              <select
                value={selectedBikeType}
                onChange={(e) => setSelectedBikeType(e.target.value)}
                className="filter-select"
              >
                {bikeTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Component Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'price' | 'performance' | 'weight')}
                className="filter-select"
              >
                <option value="performance">Performance (High to Low)</option>
                <option value="price">Price (Low to High)</option>
                <option value="weight">Weight (Light to Heavy)</option>
              </select>
            </div>
          </div>

          {/* Components Grid */}
          <div className="components-section">
            <div className="components-header">
              <h2>Available Components ({filteredComponents.length})</h2>
            </div>

            <div className="components-grid">
              {filteredComponents.map((component) => {
                const isSelected = selectedComponents.some((c) => c.id === component.id)
                return (
                  <div
                    key={component.id}
                    className={`component-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleComponent(component)}
                  >
                    <div className="component-emoji">{component.emoji}</div>
                    <h3>{component.name}</h3>
                    <p className="component-description">{component.description}</p>

                    <div className="component-stats">
                      <div className="stat">
                        <span className="stat-label">Price:</span>
                        <span className="stat-value">${component.price}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Weight:</span>
                        <span className="stat-value">{component.weight} kg</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Performance:</span>
                        <span className="stat-value">{component.performance}/100</span>
                      </div>
                    </div>

                    <div className="performance-bar">
                      <div
                        className="performance-fill"
                        style={{ width: `${component.performance}%` }}
                      ></div>
                    </div>

                    <button
                      className={`select-btn ${isSelected ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleComponent(component)
                      }}
                    >
                      {isSelected ? '✓ Selected' : 'Select'}
                    </button>
                  </div>
                )
              })}
            </div>

            {filteredComponents.length === 0 && (
              <div className="no-results">
                <p>No components found matching your filters.</p>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="summary-panel">
            <h2>Build Summary</h2>

            {selectedComponents.length === 0 ? (
              <p className="empty-summary">Select components to build your setup</p>
            ) : (
              <>
                <div className="selected-components">
                  <h3>Selected Components ({selectedComponents.length})</h3>
                  <ul>
                    {selectedComponents.map((comp) => (
                      <li key={comp.id}>
                        <span>{comp.emoji} {comp.name}</span>
                        <span className="price">${comp.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="summary-stats">
                  <div className="summary-stat">
                    <span className="label">Total Price:</span>
                    <span className="value">${totalPrice}</span>
                  </div>
                  <div className="summary-stat">
                    <span className="label">Total Weight:</span>
                    <span className="value">{totalWeight.toFixed(2)} kg</span>
                  </div>
                  <div className="summary-stat">
                    <span className="label">Avg Performance:</span>
                    <span className="value">{avgPerformance}/100</span>
                  </div>
                </div>

                <button className="clear-btn" onClick={clearSelection}>
                  Clear Selection
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BikeComponentsFinder
