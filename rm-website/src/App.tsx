// App.tsx

import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import ScrollManager from "./components/ScrollManager";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";

import Vitu from "./pages/Vitu";
import AIResearch from "./pages/AIResearch";
import Multimania from "./pages/Multimania";
import Squingo from "./pages/Squingo";
import Unipsycho from "./pages/Unipsycho";
import TechHelp from "./pages/TechHelp";
import District65 from "./pages/District65";
import Crafty from "./pages/Crafty";
import PoliceComplaints from "./pages/PoliceComplaints";
import ModelUN from "./pages/ModelUN";

import "./styles/App.css";

function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      document.documentElement.classList.add("hide-landing-scrollbar");
    } else {
      document.documentElement.classList.remove("hide-landing-scrollbar");
    }
    return () => {
      document.documentElement.classList.remove("hide-landing-scrollbar");
    };
  }, [location.pathname]);

   /*useEffect(() => {
    if (location.pathname !== "/" && location.pathname.endsWith("/")) {
      window.history.replaceState(null, "", location.pathname.slice(0, -1));
    }
  }, [location.pathname]);*/

  return (
    <div className="bg-grandbend min-h-screen">
      <Navbar />
      <ScrollManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/ai-engineer-at-vitu" element={<Vitu />} />
        <Route path="/ai-research" element={<AIResearch />} />

        <Route path="/multimania" element={<Navigate to="/multimania/" replace />} />
        <Route path="/multimania/" element={<Multimania />} />

        <Route path="/squingo" element={<Navigate to="/squingo/" replace />} />
        <Route path="/squingo/" element={<Squingo />} />

        <Route path="/unipsycho" element={<Navigate to="/unipsycho/" replace />} />
        <Route path="/unipsycho/" element={<Unipsycho />} />
        
        <Route path="/tech-help" element={<TechHelp />} />
        <Route path="/district-65" element={<District65 />} />
        <Route path="/crafty" element={<Crafty />} />
        <Route path="/police-complaints" element={<PoliceComplaints />} />
        <Route path="/model-un" element={<ModelUN />} />
        <Route path="/music" element={<Blog />} />
      </Routes>
    </div>
  );
}

export default App;
