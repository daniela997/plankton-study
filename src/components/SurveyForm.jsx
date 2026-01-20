import React, { useState, useEffect } from 'react';
import {
  generateSessionId,
  generateShuffledCategories,
  generatePairForCategory,
  validateSession
} from '../utils/surveyUtils';
import { saveParticipantSession, loadParticipantSession, testFirebaseConnection } from '../services/database';
import ImagePair from './ImagePair';
import ProgressBar from './ProgressBar';

const SurveyForm = ({ familiarity }) => {
  const [session, setSession] = useState(null);
  const [currentPair, setCurrentPair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [offlineMode, setOfflineMode] = useState(false);

  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      setError(null);

      // Test Firebase connection first (with timeout) - non-blocking
      console.log('Initializing survey session...');
      testFirebaseConnection()
        .then(connected => {
          if (!connected) {
            setOfflineMode(true);
          }
        })
        .catch(() => {
          console.warn('Firebase test timed out, enabling offline mode');
          setOfflineMode(true);
        });

      // Check URL for session parameter
      const urlParams = new URLSearchParams(window.location.search);
      const sessionParam = urlParams.get('session');

      let participantId;
      let existingSession = null;

      if (sessionParam) {
        // Load existing session from URL
        participantId = sessionParam;
        if (!offlineMode) {
          existingSession = await loadParticipantSession(participantId);
        }

        if (!existingSession) {
          if (!offlineMode) {
            setError('Session not found. Starting a new survey.');
          }
        } else if (!validateSession(existingSession)) {
          setError('Invalid session data. Starting a new survey.');
          existingSession = null;
        }
      } else {
        // Check localStorage for recent session
        const storedSessionId = localStorage.getItem('plankton-survey-session');
        if (storedSessionId) {
          if (!offlineMode) {
            existingSession = await loadParticipantSession(storedSessionId);
          }
          participantId = storedSessionId;

          if (existingSession && !validateSession(existingSession)) {
            existingSession = null;
          }
        }
      }

      if (existingSession && !existingSession.completedAt) {
        // Resume existing session
        setSession(existingSession);
        const nextCategoryId = existingSession.shuffledCategories[existingSession.currentIndex];
        const pair = generatePairForCategory(nextCategoryId);
        setCurrentPair({ categoryId: nextCategoryId, ...pair });
      } else {
        // Create new session
        participantId = generateSessionId();
        const shuffledCategories = generateShuffledCategories();
        const newSession = {
          participantId,
          shuffledCategories,
          responses: {},
          currentIndex: 0,
          familiarity
        };

        const firstCategoryId = shuffledCategories[0];
        const firstPair = generatePairForCategory(firstCategoryId);

        setSession(newSession);
        setCurrentPair({ categoryId: firstCategoryId, ...firstPair });

        // Save to localStorage and URL
        localStorage.setItem('plankton-survey-session', participantId);
        window.history.replaceState(null, null, `?session=${participantId}`);

        // Save initial session to database (non-blocking)
        saveParticipantSession(newSession).catch(err => {
          console.warn('Failed to save initial session:', err);
        });
      }
    } catch (error) {
      console.error('Error initializing session:', error);
      setError('Failed to load survey. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelection = (selectedImage) => {
    if (!session || !currentPair) return;

    console.log('Handling selection:', selectedImage);

    // Update UI immediately - don't wait for anything
    const newResponses = {
      ...session.responses,
      [currentPair.categoryId]: {
        selected: selectedImage,
        pair: {
          left: currentPair.left,
          right: currentPair.right,
          leftSubcategory: currentPair.leftSubcategory,
          rightSubcategory: currentPair.rightSubcategory
        },
        timestamp: new Date().toISOString()
      }
    };

    const newIndex = session.currentIndex + 1;
    const isCompleted = newIndex >= session.shuffledCategories.length;

    const updatedSession = {
      ...session,
      responses: newResponses,
      currentIndex: newIndex,
      completedAt: isCompleted ? new Date().toISOString() : null
    };

    // Update state immediately
    setSession(updatedSession);

      if (isCompleted) {
        setCompleted(true);
        setCurrentPair(null);
        localStorage.removeItem('plankton-survey-session');
        localStorage.removeItem('plankton-survey-consent');
        localStorage.removeItem('plankton-survey-familiarity');
      } else {
      // Load next pair immediately
      const nextCategoryId = session.shuffledCategories[newIndex];
      const nextPair = generatePairForCategory(nextCategoryId);
      setCurrentPair({ categoryId: nextCategoryId, ...nextPair });
    }

    // Save to database in background (non-blocking)
    if (!offlineMode) {
      saveParticipantSession(updatedSession)
        .then(() => {
          console.log('Session saved successfully');
        })
        .catch((error) => {
          console.warn('Failed to save session (non-blocking):', error);
          setOfflineMode(true);
        });
    }
  };

  const restartSurvey = () => {
    // Clear everything and start fresh
    localStorage.removeItem('plankton-survey-session');
    localStorage.removeItem('plankton-survey-consent');
    localStorage.removeItem('plankton-survey-familiarity');
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="survey-container">
        <div className="loading">
          <h2>Loading Plankton Survey...</h2>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error && !session) {
    // Only show error screen if we can't initialize at all
    return (
      <div className="survey-container">
        <div className="error-message">
          <h2>⚠️ Error</h2>
          <p>{error}</p>
          <button onClick={restartSurvey} className="restart-button">
            Start New Survey
          </button>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="survey-container">
        <div className="completion-message">
          <h1>🎉 Thank you for completing the survey!</h1>
          <p>Your responses have been saved successfully.</p>

          <div className="session-info">
            <h3>Survey Summary</h3>
            <p><strong>Session ID:</strong> {session.participantId}</p>
            <p><strong>Categories completed:</strong> {Object.keys(session.responses).length}</p>
            <p><strong>Completed at:</strong> {new Date(session.completedAt).toLocaleString()}</p>
          </div>

          <div className="completion-actions">
            <p>You can bookmark this page to reference your session later.</p>
            <button onClick={restartSurvey} className="restart-button">
              Take Survey Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="survey-container">
      {error && session && (
        <div className="warning-banner">
          {error}
        </div>
      )}
      <header className="survey-header">
        <h1>Plankton Image Selection Survey</h1>
        <p>Help us by selecting your preferred image in each pair.</p>
        {offlineMode && (
          <div className="offline-indicator">
            ⚠️ Offline Mode - Responses not being saved
          </div>
        )}
      </header>

      <ProgressBar
        current={session.currentIndex}
        total={session.shuffledCategories.length}
      />

      <div className="instructions">
        <h3>Instructions</h3>
        <p>Look at the two plankton images below and click on the one you think is real.</p>
        <p>You can pause and resume this survey anytime using the URL.</p>
      </div>

      {currentPair && (
        <ImagePair
          key={currentPair.categoryId}
          pair={currentPair}
          onSelect={handleSelection}
        />
      )}

      <div className="session-info">
        <details>
          <summary>Session Details</summary>
          <p><strong>Session ID:</strong> {session.participantId}</p>
          <p><strong>Current Category:</strong> {currentPair?.categoryId}</p>
          <p><strong>Progress:</strong> {session.currentIndex + 1} of {session.shuffledCategories.length}</p>
          <p><strong>Resume URL:</strong></p>
          <code className="resume-url">{window.location.href}</code>
        </details>
      </div>
    </div>
  );
};

export default SurveyForm;
