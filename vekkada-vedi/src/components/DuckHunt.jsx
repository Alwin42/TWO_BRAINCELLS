import React, { useEffect, useRef } from 'react';

const DuckHunt = ({ onGameOver }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // --- AUDIO SETUP ---
    const audioPath = '/audio/';
    // Using the exact filenames from your terminal output
    const sfx = {
      gunshot: new Audio(`${audioPath}Gunshot-SFX).mp3`),
      fall: new Audio(`${audioPath}Dead-Duck-Falls-(SFX).mp3`),
      duckGet: new Audio(`${audioPath}Duck-Get!.mp3`),
      miss: new Audio(`${audioPath}Miss(SFX).mp3`),
      quack: new Audio(`${audioPath}Duck.mp3`)
    };

    // Helper function to allow overlapping sounds (like rapid-firing)
    const playSound = (audioNode, volume = 1.0) => {
      const soundClone = audioNode.cloneNode();
      soundClone.volume = volume;
      // .catch() prevents console spam if the browser blocks audio before the first user click
      soundClone.play().catch(e => console.warn('Audio blocked until user interaction', e));
    };

    // --- FULL SCREEN RESIZE LOGIC ---
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // --- 1. ASSET LOADING ---
    const basePath = '/duck-images/';
    const flyImages = ['flying.png', 'flying02.png', 'flying03.png', 'flying04.png'].map(src => {
      const img = new Image();
      img.src = basePath + src;
      return img;
    });
    
    const fallImages = ['falling01.png', 'falling02.png'].map(src => {
      const img = new Image();
      img.src = basePath + src;
      return img;
    });

    // --- 2. GAME STATE ---
    let duck = {
      x: -100, 
      y: 300,
      width: 80,
      height: 80,
      speedX: 3,
      speedY: -0.5,
      frame: 0,
      frameCount: 0,
      animationSpeed: 10,
      state: 'flying', 
    };

    const spawnDuck = () => {
      duck.state = 'flying';
      duck.x = -100;
      duck.y = Math.random() * (canvas.height * 0.5) + 50; 
      duck.speedX = 2.5 + Math.random() * 2; 
      duck.speedY = -1 + Math.random() * 2; 
      duck.frame = 0;
      duck.frameCount = 0;
      
      // Play a quack when a new duck appears
      playSound(sfx.quack, 0.4); 
    };

    spawnDuck();

    // --- 3. INPUT HANDLING ---
    const handleMouseInput = (e) => {
      e.preventDefault();
      
      const mouseX = e.offsetX; 
      const mouseY = e.offsetY;

      if (e.button === 0) { // Left Click = Shoot
        
        // 1. Always play the gunshot sound on left click!
        playSound(sfx.gunshot);

        // 2. Check for a hit
        if (
          duck.state === 'flying' &&
          mouseX >= duck.x && mouseX <= duck.x + duck.width &&
          mouseY >= duck.y && mouseY <= duck.y + duck.height
        ) {
          // HIT!
          duck.state = 'falling';
          duck.frame = 0;
          duck.frameCount = 0;
          
          // Play the duck getting hit / falling sounds
          playSound(sfx.fall);
          setTimeout(() => playSound(sfx.duckGet), 800); // Play "Duck Get!" slightly delayed
        }
      } else if (e.button === 2) { // Right Click
        spawnDuck(); 
      }
    };

    canvas.addEventListener('mousedown', handleMouseInput);
    canvas.addEventListener('contextmenu', e => e.preventDefault());

    // --- 4. THE GAME LOOP ---
    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      duck.frameCount++;

      if (duck.state === 'flying') {
        duck.x += duck.speedX;
        duck.y += duck.speedY;

        if (duck.y < 50 || duck.y > canvas.height * 0.7) duck.speedY *= -1;

        if (duck.frameCount % duck.animationSpeed === 0) {
          duck.frame = (duck.frame + 1) % flyImages.length;
        }

        // Missed! Duck escapes off the right edge
        if (duck.x > canvas.width) {
          playSound(sfx.miss); // Dog laughing / Miss sound
          spawnDuck();
        }

      } else if (duck.state === 'falling') {
        duck.y += 6; 

        if (duck.frameCount % 5 === 0) { 
          duck.frame = (duck.frame + 1) % fallImages.length;
        }

        // Duck hits the ground
        if (duck.y > canvas.height) {
          spawnDuck();
        }
      }

      const imgArray = duck.state === 'flying' ? flyImages : fallImages;
      const currentImage = imgArray[duck.frame] || imgArray[0]; 
      
      if (currentImage && currentImage.complete) {
        ctx.drawImage(currentImage, duck.x, duck.y, duck.width, duck.height);
      }
      
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    // --- 5. CLEANUP ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousedown', handleMouseInput);
      canvas.removeEventListener('contextmenu', e => e.preventDefault());
    };
  }, []); 

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        display: 'block', 
        backgroundColor: '#64b0ff', 
        cursor: 'crosshair',
      }} 
    />
  );
};

export default DuckHunt;