import React, { useEffect, useRef } from 'react';

const DuckHunt = ({ onGameOver }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

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
    // We use a mutable object so we can update it 60 times a second without React lagging
    let duck = {
      x: -100, 
      y: 300,
      width: 80,
      height: 80,
      speedX: 3,
      speedY: -0.5,
      frame: 0,
      frameCount: 0,
      animationSpeed: 10, // Lower = faster flapping
      state: 'flying', 
    };

    const spawnDuck = () => {
      duck.state = 'flying';
      duck.x = -100;
      duck.y = Math.random() * 300 + 100; 
      
      // Give each duck a slightly random flight speed and trajectory
      duck.speedX = 2.5 + Math.random() * 2; 
      duck.speedY = -1 + Math.random() * 2; 
      
      duck.frame = 0;
      duck.frameCount = 0;
    };

    spawnDuck();

    // --- 3. INPUT HANDLING ---
    const handleMouseInput = (e) => {
      e.preventDefault();
      
      // offsetX/Y gives exact coordinates relative to the canvas itself
      const mouseX = e.offsetX; 
      const mouseY = e.offsetY;

      if (e.button === 0) { // Left Click
        if (
          duck.state === 'flying' &&
          mouseX >= duck.x && mouseX <= duck.x + duck.width &&
          mouseY >= duck.y && mouseY <= duck.y + duck.height
        ) {
          // HIT!
          duck.state = 'falling';
          duck.frame = 0;
          duck.frameCount = 0;
        }
      } else if (e.button === 2) { // Right Click
        spawnDuck(); 
      }
    };

    canvas.addEventListener('mousedown', handleMouseInput);
    canvas.addEventListener('contextmenu', e => e.preventDefault());

    // --- 4. THE GAME LOOP ---
    const gameLoop = () => {
      // 1. Clear the previous frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 2. Update the duck's math
      duck.frameCount++;

      if (duck.state === 'flying') {
        duck.x += duck.speedX;
        duck.y += duck.speedY;

        // Bounce off top/bottom invisible walls so it doesn't fly off-screen vertically
        if (duck.y < 50 || duck.y > 400) duck.speedY *= -1;

        // Cycle through flying sprite frames
        if (duck.frameCount % duck.animationSpeed === 0) {
          duck.frame = (duck.frame + 1) % flyImages.length;
        }

        // Respawn if it escapes off the right side of the screen
        if (duck.x > canvas.width) {
          spawnDuck();
        }

      } else if (duck.state === 'falling') {
        duck.y += 6; // Fall straight down

        // Cycle through falling sprite frames (spin faster than flying)
        if (duck.frameCount % 5 === 0) { 
          duck.frame = (duck.frame + 1) % fallImages.length;
        }

        // Respawn after it falls below the bottom of the canvas
        if (duck.y > canvas.height) {
          spawnDuck();
        }
      }

      // 3. Draw the current state to the canvas
      const imgArray = duck.state === 'flying' ? flyImages : fallImages;
      const currentImage = imgArray[duck.frame] || imgArray[0]; 
      
      if (currentImage && currentImage.complete) {
        ctx.drawImage(currentImage, duck.x, duck.y, duck.width, duck.height);
      }
      
      // 4. Loop again
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    // --- 5. CLEANUP ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousedown', handleMouseInput);
      canvas.removeEventListener('contextmenu', e => e.preventDefault());
    };
  }, []); 

  return (
    <canvas 
      ref={canvasRef} 
      width={800} 
      height={600} 
      style={{ 
        backgroundColor: '#64b0ff', 
        cursor: 'crosshair',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        border: '4px solid #fff'
      }} 
    />
  );
};

export default DuckHunt;