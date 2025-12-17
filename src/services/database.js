import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase';

// Test Firebase connectivity
export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');

    // Add timeout to the connection test
    const testPromise = setDoc(doc(db, 'test_connection', 'test'), {
      test: true,
      timestamp: new Date()
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection timeout')), 5000)
    );

    await Promise.race([testPromise, timeoutPromise]);
    console.log('Firebase connection successful');
    return true;
  } catch (error) {
    console.error('Firebase connection failed:', error.message);
    console.error('Full error:', error);
    return false;
  }
};

// Save participant session to Firestore
export const saveParticipantSession = async (sessionData) => {
  try {
    console.log('Attempting to save session for participant:', sessionData.participantId);
    const docRef = doc(db, 'survey_sessions', sessionData.participantId);
    await setDoc(docRef, {
      ...sessionData,
      lastUpdated: new Date()
    }, { merge: true }); // Merge to preserve existing data
    console.log('Session saved successfully for participant:', sessionData.participantId);
  } catch (error) {
    console.error('Error saving session:', error);
    throw error;
  }
};

// Load participant session from Firestore
export const loadParticipantSession = async (participantId) => {
  try {
    const docRef = doc(db, 'survey_sessions', participantId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('Session loaded successfully');
      return data;
    } else {
      console.log('No session found for participant:', participantId);
      return null;
    }
  } catch (error) {
    console.error('Error loading session:', error);
    return null;
  }
};

// Get all completed survey responses (for analysis)
export const getAllResponses = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'survey_sessions'));
    const responses = [];
    querySnapshot.forEach((doc) => {
      responses.push({ id: doc.id, ...doc.data() });
    });
    console.log(`Loaded ${responses.length} responses`);
    return responses;
  } catch (error) {
    console.error('Error getting responses:', error);
    return [];
  }
};

// Get responses for a specific participant
export const getParticipantResponses = async (participantId) => {
  try {
    const session = await loadParticipantSession(participantId);
    return session ? session.responses : {};
  } catch (error) {
    console.error('Error getting participant responses:', error);
    return {};
  }
};

// Check if participant has completed the survey
export const isParticipantCompleted = async (participantId) => {
  try {
    const session = await loadParticipantSession(participantId);
    return session ? !!session.completedAt : false;
  } catch (error) {
    console.error('Error checking completion status:', error);
    return false;
  }
};

// Get survey statistics
export const getSurveyStats = async () => {
  try {
    const responses = await getAllResponses();
    const totalParticipants = responses.length;
    const completedParticipants = responses.filter(r => r.completedAt).length;
    const totalResponses = responses.reduce((sum, r) => sum + Object.keys(r.responses || {}).length, 0);

    return {
      totalParticipants,
      completedParticipants,
      completionRate: totalParticipants > 0 ? (completedParticipants / totalParticipants) * 100 : 0,
      totalResponses,
      averageResponsesPerParticipant: totalParticipants > 0 ? totalResponses / totalParticipants : 0
    };
  } catch (error) {
    console.error('Error getting survey stats:', error);
    return {
      totalParticipants: 0,
      completedParticipants: 0,
      completionRate: 0,
      totalResponses: 0,
      averageResponsesPerParticipant: 0
    };
  }
};
