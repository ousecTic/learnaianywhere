import React from 'react';
import worldMap from '../assets/images/about/world-map.png';

const GlobalImpact = () => {
  return (
    <section className="global-impact">
      <div className="container">
        <h2>Our Global Reach</h2>
        <p>We are running in over 60 countries</p>
        <div className="world-map-container">
          <img src={worldMap} alt="World map showing learners in over 60 countries" className="world-map" />
        </div>
      </div>
    </section>
  );
};

export default GlobalImpact;
