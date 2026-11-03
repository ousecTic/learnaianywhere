import React from 'react';
import worldMap from '../assets/images/about/world-map.svg';
import countries from '../data/learner-countries.json';

// The map is drawn from src/data/learner-countries.json by scripts/build-map.mjs
// (npm run build:map), so the count here and the map always match.
const GlobalImpact = () => {
  return (
    <section className="global-impact">
      <div className="container">
        <h2>Our Global Reach</h2>
        <p>We have learners in {countries.length} countries</p>
        <div className="world-map-container">
          <img src={worldMap} alt={`World map with the ${countries.length} countries where we have learners highlighted`} className="world-map" />
        </div>
      </div>
    </section>
  );
};

export default GlobalImpact;
