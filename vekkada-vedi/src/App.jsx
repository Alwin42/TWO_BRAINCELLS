import { useState } from 'react';
import StartScreen from './components/StartScreen';
// import GameBoard from './components/GameBoard'; // We will build this next

export default function App() {
  // 'booting', 'playing', 'game_over'
  const [appState, setAppState] = useState('booting'); 

  const startGame = () => {
    setAppState('playing');
  };

  return (
    <div className="app-container">
      {appState === 'booting' && <StartScreen onStart={startGame} />}
      
      {appState === 'playing' && (
        <div style={{ color: 'white', textAlign: 'center', marginTop: '20vh' }}>
          <h2>Game Board goes here!</h2>
          {/* <GameBoard /> */}
        </div>
      )}
    </div>
  );
}