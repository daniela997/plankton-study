import React, { useState, useEffect } from 'react';
import SurveyForm from './components/SurveyForm';
import IntroPage from './components/IntroPage';
import FamiliarityPage from './components/FamiliarityPage';
import './App.css';

const CONSENT_KEY = 'plankton-survey-consent';
const FAMILIARITY_KEY = 'plankton-survey-familiarity';

function App() {
  const [hasConsented, setHasConsented] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [familiarity, setFamiliarity] = useState({
    planktonImaging: 0,
    mlExperience: 0
  });
  const [hasSharedFamiliarity, setHasSharedFamiliarity] = useState(false);

  useEffect(() => {
    const storedConsent = localStorage.getItem(CONSENT_KEY);
    const storedFamiliarity = JSON.parse(localStorage.getItem(FAMILIARITY_KEY) || 'null');

    if (storedConsent === 'true') {
      setHasConsented(true);
      setIsChecked(true);
    }
    if (storedFamiliarity) {
      setFamiliarity(storedFamiliarity);
      setHasSharedFamiliarity(true);
    }
  }, []);

  const handleConsent = () => {
    localStorage.setItem(CONSENT_KEY, 'true');
    setHasConsented(true);
  };

  const handleFamiliaritySubmit = () => {
    localStorage.setItem(FAMILIARITY_KEY, JSON.stringify(familiarity));
    setHasSharedFamiliarity(true);
  };

  if (!hasConsented) {
    return (
      <div className="App">
        <IntroPage onConsent={handleConsent} isChecked={isChecked} setChecked={setIsChecked} />
      </div>
    );
  }

  if (!hasSharedFamiliarity) {
    return (
      <div className="App">
        <FamiliarityPage
          familiarity={familiarity}
          setFamiliarity={setFamiliarity}
          onSubmit={handleFamiliaritySubmit}
        />
      </div>
    );
  }

  return (
    <div className="App">
      <SurveyForm familiarity={familiarity} />
    </div>
  );
}

export default App;
