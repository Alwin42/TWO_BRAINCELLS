import { useState } from 'react';
import StartScreen from './components/StartScreen';
import DuckHunt from './components/DuckHunt';

export default function App() {
  // 'booting', 'playing', 'game_over'
  const [appState, setAppState] = useState('booting'); 

  const startGame = () => {
    setAppState('playing');
  };

  return (
    // Ensure the main container has no default margins
    <div className="app-container" style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
      
      {appState === 'booting' && <StartScreen onStart={startGame} />}
      
      {appState === 'playing' && (
        
        <div style={{ width: '100vw', height: '100vh' }}>
          <DuckHunt />
        </div>
      )}
      
    </div>
  );
}