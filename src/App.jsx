import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import Admin from './pages/Admin';
import WelcomePopup from './components/WelcomePopup';

function App() {
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  useEffect(() => {
    // Check if user has seen the popup before
    const hasSeenPopup = sessionStorage.getItem('hasSeenWelcomePopup');
    
    if (!hasSeenPopup) {
      // Show popup after 500ms
      setTimeout(() => {
        setShowWelcomePopup(true);
      }, 500);
    }
  }, []);

  const handleClosePopup = () => {
    setShowWelcomePopup(false);
    sessionStorage.setItem('hasSeenWelcomePopup', 'true');
  };

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      {showWelcomePopup && <WelcomePopup onClose={handleClosePopup} />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;