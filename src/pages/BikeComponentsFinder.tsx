import React from 'react';

interface BikeComponent {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface BikeComponentsFinderProps {
  onComponentSelected: (component: BikeComponent) => void;
}

function BikeComponentsFinder({ onComponentSelected }: BikeComponentsFinderProps) {
  const [selectedComponent, setSelectedComponent] = React.useState<BikeComponent | null>(null);

  const handleSelectComponent = (component: BikeComponent) => {
    setSelectedComponent(component);
    onComponentSelected(component);
  };

  return (
    <div className="bike-components-finder-container">
      <div className="bike-components-finder-content">
        <h2>Find Your Mountain Bike Components</h2>
        <p className="bike-subtitle">Discover and select the perfect components for your mountain bike!</p>

        <div className="components-grid">
          {/* Map through bike components and display them */}
        </div>
      </div>
    </div>
  );
}

export default BikeComponentsFinder;