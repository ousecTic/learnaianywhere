import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Curriculum from './pages/Curriculum';
import IntroToAI from './pages/IntroToAI';
import IntroToGenerativeAI from './pages/IntroToGenerativeAI';
import GetInvolved from './pages/GetInvolved';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/curriculum/intro-to-ai" element={<IntroToAI />} />
            <Route path="/curriculum/intro-to-generative-ai" element={<IntroToGenerativeAI />} />
            <Route path="/get-involved" element={<GetInvolved />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
