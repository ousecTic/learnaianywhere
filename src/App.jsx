import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AnnouncementBanner from './components/AnnouncementBanner';
import Home from './pages/Home';
import IntroToAI from './pages/IntroToAI';
import IntroToGenerativeAI from './pages/IntroToGenerativeAI';
import AILiteracyForEveryone from './pages/AILiteracyForEveryone';
import GetInvolved from './pages/GetInvolved';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Donation from './pages/Donation';
import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <AnnouncementBanner />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/curriculum" element={<Navigate to="/curriculum/intro-to-ai" replace />} />
            <Route path="/curriculum/intro-to-ai" element={<IntroToAI />} />
            <Route path="/curriculum/intro-to-generative-ai" element={<IntroToGenerativeAI />} />
            <Route path="/courses/ai-literacy-for-everyone" element={<AILiteracyForEveryone />} />
            <Route path="/get-involved" element={<GetInvolved />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/donate" element={<Donation />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
