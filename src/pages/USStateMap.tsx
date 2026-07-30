import { useState } from 'react'
import './USStateMap.css'

interface StateInfo {
  name: string
  abbreviation: string
  capital: string
  population: string
  area: string
  founded: string
  region: string
}

const stateData: Record<string, StateInfo> = {
  AL: { name: 'Alabama', abbreviation: 'AL', capital: 'Montgomery', population: '5.1M', area: '52,420 sq mi', founded: '1819', region: 'Southeast' },
  AK: { name: 'Alaska', abbreviation: 'AK', capital: 'Juneau', population: '733K', area: '665,384 sq mi', founded: '1959', region: 'West' },
  AZ: { name: 'Arizona', abbreviation: 'AZ', capital: 'Phoenix', population: '7.4M', area: '113,990 sq mi', founded: '1912', region: 'Southwest' },
  AR: { name: 'Arkansas', abbreviation: 'AR', capital: 'Little Rock', population: '3.0M', area: '53,179 sq mi', founded: '1836', region: 'South' },
  CA: { name: 'California', abbreviation: 'CA', capital: 'Sacramento', population: '39.0M', area: '163,696 sq mi', founded: '1850', region: 'West' },
  CO: { name: 'Colorado', abbreviation: 'CO', capital: 'Denver', population: '5.8M', area: '104,094 sq mi', founded: '1876', region: 'Mountain' },
  CT: { name: 'Connecticut', abbreviation: 'CT', capital: 'Hartford', population: '3.6M', area: '5,543 sq mi', founded: '1788', region: 'Northeast' },
  DE: { name: 'Delaware', abbreviation: 'DE', capital: 'Dover', population: '1.0M', area: '2,489 sq mi', founded: '1787', region: 'Northeast' },
  FL: { name: 'Florida', abbreviation: 'FL', capital: 'Tallahassee', population: '22.2M', area: '65,758 sq mi', founded: '1845', region: 'Southeast' },
  GA: { name: 'Georgia', abbreviation: 'GA', capital: 'Atlanta', population: '10.9M', area: '59,425 sq mi', founded: '1788', region: 'Southeast' },
  HI: { name: 'Hawaii', abbreviation: 'HI', capital: 'Honolulu', population: '1.4M', area: '10,932 sq mi', founded: '1959', region: 'Pacific' },
  ID: { name: 'Idaho', abbreviation: 'ID', capital: 'Boise', population: '1.9M', area: '83,569 sq mi', founded: '1890', region: 'Mountain' },
  IL: { name: 'Illinois', abbreviation: 'IL', capital: 'Springfield', population: '12.6M', area: '57,914 sq mi', founded: '1818', region: 'Midwest' },
  IN: { name: 'Indiana', abbreviation: 'IN', capital: 'Indianapolis', population: '6.8M', area: '36,420 sq mi', founded: '1816', region: 'Midwest' },
  IA: { name: 'Iowa', abbreviation: 'IA', capital: 'Des Moines', population: '3.2M', area: '56,273 sq mi', founded: '1846', region: 'Midwest' },
  KS: { name: 'Kansas', abbreviation: 'KS', capital: 'Topeka', population: '2.9M', area: '82,279 sq mi', founded: '1861', region: 'Midwest' },
  KY: { name: 'Kentucky', abbreviation: 'KY', capital: 'Frankfort', population: '4.5M', area: '40,408 sq mi', founded: '1792', region: 'South' },
  LA: { name: 'Louisiana', abbreviation: 'LA', capital: 'Baton Rouge', population: '4.6M', area: '52,378 sq mi', founded: '1812', region: 'South' },
  ME: { name: 'Maine', abbreviation: 'ME', capital: 'Augusta', population: '1.3M', area: '35,386 sq mi', founded: '1820', region: 'Northeast' },
  MD: { name: 'Maryland', abbreviation: 'MD', capital: 'Annapolis', population: '6.2M', area: '12,406 sq mi', founded: '1788', region: 'Northeast' },
  MA: { name: 'Massachusetts', abbreviation: 'MA', capital: 'Boston', population: '7.0M', area: '10,554 sq mi', founded: '1788', region: 'Northeast' },
  MI: { name: 'Michigan', abbreviation: 'MI', capital: 'Lansing', population: '10.0M', area: '96,714 sq mi', founded: '1837', region: 'Midwest' },
  MN: { name: 'Minnesota', abbreviation: 'MN', capital: 'Saint Paul', population: '5.7M', area: '86,936 sq mi', founded: '1858', region: 'Midwest' },
  MS: { name: 'Mississippi', abbreviation: 'MS', capital: 'Jackson', population: '2.9M', area: '48,432 sq mi', founded: '1817', region: 'South' },
  MO: { name: 'Missouri', abbreviation: 'MO', capital: 'Jefferson City', population: '6.2M', area: '69,707 sq mi', founded: '1821', region: 'Midwest' },
  MT: { name: 'Montana', abbreviation: 'MT', capital: 'Helena', population: '1.1M', area: '147,040 sq mi', founded: '1889', region: 'Mountain' },
  NE: { name: 'Nebraska', abbreviation: 'NE', capital: 'Lincoln', population: '1.9M', area: '77,348 sq mi', founded: '1867', region: 'Midwest' },
  NV: { name: 'Nevada', abbreviation: 'NV', capital: 'Carson City', population: '3.2M', area: '110,572 sq mi', founded: '1864', region: 'West' },
  NH: { name: 'New Hampshire', abbreviation: 'NH', capital: 'Concord', population: '1.4M', area: '9,349 sq mi', founded: '1788', region: 'Northeast' },
  NJ: { name: 'New Jersey', abbreviation: 'NJ', capital: 'Trenton', population: '9.3M', area: '8,723 sq mi', founded: '1787', region: 'Northeast' },
  NM: { name: 'New Mexico', abbreviation: 'NM', capital: 'Santa Fe', population: '2.1M', area: '121,590 sq mi', founded: '1912', region: 'Southwest' },
  NY: { name: 'New York', abbreviation: 'NY', capital: 'Albany', population: '19.5M', area: '54,555 sq mi', founded: '1788', region: 'Northeast' },
  NC: { name: 'North Carolina', abbreviation: 'NC', capital: 'Raleigh', population: '10.4M', area: '53,819 sq mi', founded: '1789', region: 'Southeast' },
  ND: { name: 'North Dakota', abbreviation: 'ND', capital: 'Bismarck', population: '780K', area: '70,698 sq mi', founded: '1889', region: 'Midwest' },
  OH: { name: 'Ohio', abbreviation: 'OH', capital: 'Columbus', population: '11.8M', area: '44,826 sq mi', founded: '1803', region: 'Midwest' },
  OK: { name: 'Oklahoma', abbreviation: 'OK', capital: 'Oklahoma City', population: '4.0M', area: '69,899 sq mi', founded: '1907', region: 'South' },
  OR: { name: 'Oregon', abbreviation: 'OR', capital: 'Salem', population: '4.2M', area: '98,379 sq mi', founded: '1859', region: 'West' },
  PA: { name: 'Pennsylvania', abbreviation: 'PA', capital: 'Harrisburg', population: '12.8M', area: '46,054 sq mi', founded: '1787', region: 'Northeast' },
  RI: { name: 'Rhode Island', abbreviation: 'RI', capital: 'Providence', population: '1.1M', area: '1,214 sq mi', founded: '1790', region: 'Northeast' },
  SC: { name: 'South Carolina', abbreviation: 'SC', capital: 'Columbia', population: '5.3M', area: '32,020 sq mi', founded: '1788', region: 'Southeast' },
  SD: { name: 'South Dakota', abbreviation: 'SD', capital: 'Pierre', population: '887K', area: '77,116 sq mi', founded: '1889', region: 'Midwest' },
  TN: { name: 'Tennessee', abbreviation: 'TN', capital: 'Nashville', population: '7.1M', area: '42,144 sq mi', founded: '1796', region: 'South' },
  TX: { name: 'Texas', abbreviation: 'TX', capital: 'Austin', population: '30.0M', area: '268,596 sq mi', founded: '1845', region: 'South' },
  UT: { name: 'Utah', abbreviation: 'UT', capital: 'Salt Lake City', population: '3.4M', area: '84,897 sq mi', founded: '1896', region: 'Mountain' },
  VT: { name: 'Vermont', abbreviation: 'VT', capital: 'Montpelier', population: '645K', area: '9,616 sq mi', founded: '1791', region: 'Northeast' },
  VA: { name: 'Virginia', abbreviation: 'VA', capital: 'Richmond', population: '8.6M', area: '42,775 sq mi', founded: '1788', region: 'Southeast' },
  WA: { name: 'Washington', abbreviation: 'WA', capital: 'Olympia', population: '7.7M', area: '71,298 sq mi', founded: '1889', region: 'West' },
  WV: { name: 'West Virginia', abbreviation: 'WV', capital: 'Charleston', population: '1.7M', area: '24,230 sq mi', founded: '1863', region: 'Southeast' },
  WI: { name: 'Wisconsin', abbreviation: 'WI', capital: 'Madison', population: '5.9M', area: '65,496 sq mi', founded: '1848', region: 'Midwest' },
  WY: { name: 'Wyoming', abbreviation: 'WY', capital: 'Cheyenne', population: '580K', area: '97,813 sq mi', founded: '1890', region: 'Mountain' },
}

function USStateMap() {
  const [selectedState, setSelectedState] = useState<StateInfo | null>(null)
  const [highlightedRegion, setHighlightedRegion] = useState<string | null>(null)

  const handleStateClick = (abbreviation: string) => {
    setSelectedState(stateData[abbreviation])
  }

  const handleRegionFilter = (region: string) => {
    setHighlightedRegion(highlightedRegion === region ? null : region)
  }

  const regions = ['Northeast', 'Southeast', 'Midwest', 'South', 'Southwest', 'Mountain', 'West', 'Pacific']

  const stateGrid = Object.entries(stateData).map(([abbr, info]) => ({
    ...info,
    abbreviation: abbr,
  }))

  return (
    <div className="map-container">
      <div className="map-content">
        <h1>🗺️ Interactive US State Map</h1>
        <p className="subtitle">Click on any state to learn more about it</p>

        <div className="region-filters">
          <h3>Filter by Region:</h3>
          <div className="filter-buttons">
            {regions.map((region) => (
              <button
                key={region}
                className={`filter-btn ${highlightedRegion === region ? 'active' : ''}`}
                onClick={() => handleRegionFilter(region)}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        <div className="states-grid">
          {stateGrid
            .filter((state) => !highlightedRegion || state.region === highlightedRegion)
            .map((state) => (
              <button
                key={state.abbreviation}
                className={`state-button ${selectedState?.abbreviation === state.abbreviation ? 'selected' : ''}`}
                onClick={() => handleStateClick(state.abbreviation)}
              >
                <div className="state-abbr">{state.abbreviation}</div>
                <div className="state-name">{state.name}</div>
              </button>
            ))}
        </div>

        {selectedState && (
          <div className="state-info-panel">
            <button className="close-btn" onClick={() => setSelectedState(null)}>
              ✕
            </button>
            <h2>{selectedState.name}</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Abbreviation:</span>
                <span className="value">{selectedState.abbreviation}</span>
              </div>
              <div className="info-item">
                <span className="label">Capital:</span>
                <span className="value">{selectedState.capital}</span>
              </div>
              <div className="info-item">
                <span className="label">Population:</span>
                <span className="value">{selectedState.population}</span>
              </div>
              <div className="info-item">
                <span className="label">Area:</span>
                <span className="value">{selectedState.area}</span>
              </div>
              <div className="info-item">
                <span className="label">Founded:</span>
                <span className="value">{selectedState.founded}</span>
              </div>
              <div className="info-item">
                <span className="label">Region:</span>
                <span className="value">{selectedState.region}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default USStateMap
