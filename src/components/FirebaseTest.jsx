import React, { useState, useEffect } from 'react';
import { testFirebaseConnection, saveParticipantSession } from './services/database';

const FirebaseTest = () => {
  const [status, setStatus] = useState('Testing Firebase...');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const isConnected = await testFirebaseConnection();
      setConnected(isConnected);
      setStatus(isConnected ? '✅ Firebase Connected!' : '❌ Firebase Failed');
    } catch (error) {
      setStatus('❌ Firebase Error: ' + error.message);
      setConnected(false);
    }
  };

  const testSave = async () => {
    try {
      setStatus('Testing save operation...');
      await saveParticipantSession({
        participantId: 'test-' + Date.now(),
        responses: { test: 'data' },
        currentIndex: 0
      });
      setStatus('✅ Save operation successful!');
      setConnected(true);
    } catch (error) {
      setStatus('❌ Save failed: ' + error.message);
      setConnected(false);
    }
  };

  return (
    <div style={{
      padding: '20px',
      margin: '20px',
      border: '2px solid #ccc',
      borderRadius: '10px',
      backgroundColor: connected ? '#d4edda' : '#f8d7da'
    }}>
      <h2>Firebase Connection Test</h2>
      <p>{status}</p>
      <button onClick={testConnection} style={{ margin: '10px', padding: '10px' }}>
        Test Connection
      </button>
      <button onClick={testSave} style={{ margin: '10px', padding: '10px' }}>
        Test Save
      </button>
      <p><strong>Instructions:</strong></p>
      <ol>
        <li>Go to Firebase Console</li>
        <li>Enable Firestore Database</li>
        <li>Refresh this page</li>
        <li>Click "Test Connection"</li>
      </ol>
    </div>
  );
};

export default FirebaseTest;
