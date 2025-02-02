import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import CurriculumFeatures from './components/CurriculumFeatures'
import CallToAction from './components/CallToAction'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <CurriculumFeatures />
          <CallToAction />
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
