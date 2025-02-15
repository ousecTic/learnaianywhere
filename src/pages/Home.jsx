import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import CurriculumFeatures from '../components/CurriculumFeatures';
import CallToAction from '../components/CallToAction';

const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <CurriculumFeatures />
      <CallToAction />
    </>
  );
};

export default Home;
