import React, { useEffect, useRef, useState } from 'react';

interface Petal {
  x: number;
  y: number;
  w: number;
  h: number;
  opacity: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  swayAmplitude: number;
  swayFrequency: number;
  swayPhase: number;
  z: number; // Depth factor: 0.5 (far) to 1.5 (close)
}

interface SakuraBackgroundProps {
  onLoad?: () => void;
}

const SakuraBackground: React.FC<SakuraBackgroundProps> = ({ onLoad }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const bgUrl = 'https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=2560&auto=format&fit=crop';

  // Preload Background Image
  useEffect(() => {
    const img = new Image();
    img.src = bgUrl;
    img.onload = () => {
      setIsLoaded(true);
      if (onLoad) onLoad();
    };
  }, [onLoad]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let petals: Petal[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createPetal = (initialY?: number): Petal => {
      // More realistic, varied petal colors (white to soft pink)
      const colors = ['rgba(255, 255, 255, 0.9)', 'rgba(255, 240, 245, 0.8)', 'rgba(255, 228, 225, 0.85)'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Depth factor for parallax
      const z = Math.random() * 1.0 + 0.5; // Range: 0.5 to 1.5

      return {
        x: Math.random() * canvas.width,
        y: initialY !== undefined ? initialY : -20,
        // Scale size based on depth
        w: (10 + Math.random() * 15) * z * 0.6,
        h: (8 + Math.random() * 10) * z * 0.6,
        opacity: (0.5 + Math.random() * 0.5) * Math.min(1, z),
        // Scale speed based on depth (parallax)
        speedX: (Math.random() * 1.0 - 0.5) * z, 
        speedY: (0.8 + Math.random() * 1.2) * z, 
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() * 2 - 1) * 1.5,
        color: randomColor,
        swayAmplitude: (0.5 + Math.random() * 2.0) * z,
        swayFrequency: 0.005 + Math.random() * 0.01,
        swayPhase: Math.random() * Math.PI * 2,
        z: z
      };
    };

    const initPetals = () => {
      petals = [];
      // Moderate density
      const petalCount = Math.floor((window.innerWidth * window.innerHeight) / 10000); 
      for (let i = 0; i < petalCount; i++) {
        petals.push(createPetal(Math.random() * canvas.height));
      }
    };

    const drawPetal = (p: Petal) => {
      if (!ctx) return;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      
      // Realistic petal shape using curves
      ctx.beginPath();
      ctx.moveTo(0, 0);
      // Left curve
      ctx.bezierCurveTo(-p.w / 2, p.h / 3, -p.w / 2, p.h, 0, p.h);
      // Right curve
      ctx.bezierCurveTo(p.w / 2, p.h, p.w / 2, p.h / 3, 0, 0);
      ctx.fill();
      
      ctx.restore();
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sort petals by Z to draw further ones first (optional but good for correct layering if overlapping)
      // petals.sort((a, b) => a.z - b.z); 

      petals.forEach((p, index) => {
        p.y += p.speedY;
        
        // Swaying motion
        p.x += Math.sin(p.y * p.swayFrequency + p.swayPhase) * 0.3 * p.z + p.speedX;
        p.rotation += p.rotationSpeed;

        // Reset if it goes off screen
        if (p.y > canvas.height + 20) {
            petals[index] = createPetal();
        }
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.x < -20) p.x = canvas.width + 20;

        drawPetal(p);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    initPetals();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={`fixed inset-0 z-0 overflow-hidden bg-slate-100 transition-opacity duration-[1500ms] ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Realistic Background Image with Depth of Field Blur */}
        {/* Scale 110% to prevent white edges from blur */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] ease-in-out transform scale-110 hover:scale-125"
          style={{ 
            backgroundImage: `url('${bgUrl}')`,
            filter: 'brightness(1.05) contrast(0.95) blur(4px)' 
          }}
        />
        {/* Vignette Overlay to focus center */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/20 mix-blend-multiply pointer-events-none"></div>

        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-pink-100/30 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
        
        {/* Falling Petals Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
    </div>
  );
};

export default SakuraBackground;