import { useState, useEffect } from 'react';

export default function StartScreen({ onStart }) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Simulate asset loading
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoaded(true);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const handleStartClick = () => {
    const startAudio = new Audio('/audio/Game-Start.mp3');
    startAudio.play().catch(error => console.log("Audio play failed:", error));
    onStart();
  };

  return (
    <div 
      className="relative w-full h-screen flex flex-col justify-center items-center text-center bg-cover bg-center"
      style={{ backgroundImage: "url('/backgrounds/home-screen.png')" }}
    >
      {/* 90s CRT Monitor Effect */}
      <div className="absolute inset-0 z-0 crt-overlay"></div>
      
      {/* Big, Separate Bouncing Duck Logo */}
      <img 
        src="/images/duck-logo.png" 
        alt="Giant Duck Logo" 
        className="z-10 w-48 h-48 md:w-64 md:h-64 mb-8 animate-bounce pixelated drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]"
      />

      {/* Main Content Box */}
      <div className="z-10 flex flex-col items-center bg-black/70 p-10 rounded-2xl border-2 border-arcade-yellow shadow-2xl">
        <h1 className="text-arcade-yellow text-4xl md:text-6xl mb-6 drop-shadow-[4px_4px_0_rgba(170,0,0,1)]">
          Vekkada Vedi
        </h1>
        
        {!isLoaded ? (
          <div className="flex flex-col items-center">
            <p className="text-white text-sm md:text-base mt-2">
              LOADING ASSETS... {loadingProgress}%
            </p>
            
            <div className="w-72 md:w-96 h-8 border-4 border-white mt-4 p-0.5">
              <div 
                className="h-full bg-terminal-green transition-all duration-200" 
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <button 
            className="mt-4 bg-transparent border-none text-terminal-green font-pixel text-xl md:text-2xl cursor-pointer animate-blink hover:scale-110 transition-transform" 
            onClick={handleStartClick}
          >
            CLICK TO START
          </button>
        )}
      </div>
    </div>
  );
}