//import React from 'react';
import './styles/App.css';
import About from './components/About';
import ParticlesBackground from './components/ParticlesBackground';

function App() {
  return (
    <div className="relative overflow-hidden bg-black min-h-screen">
      {/* Background Particles */}
      <ParticlesBackground />

      {/* Foreground Content */}
      <div className="relative z-10">
        <About />
      </div>
    </div>
  );
}

export default App;
