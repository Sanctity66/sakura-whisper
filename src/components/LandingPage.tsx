import React, { useState } from 'react';
import { ChevronRight, Flower2 } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 animate-fade-in-slow">
      
      {/* Main Title Block */}
      <div className="mb-12 relative group">
        <div className="absolute inset-0 bg-white/40 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        <h1 className="relative text-6xl md:text-8xl font-serif font-bold text-slate-800 tracking-tighter drop-shadow-sm mb-4">
          <span className="block text-transparent bg-clip-text bg-gradient-to-br from-pink-600 to-slate-800">
            樱花
          </span>
          <span className="block text-5xl md:text-7xl mt-2 text-slate-700">
            期权笔记
          </span>
        </h1>
        <div className="h-1 w-24 bg-pink-400 mx-auto rounded-full mt-6 mb-6"></div>
        <p className="text-xl md:text-2xl text-slate-600 font-light tracking-widest font-serif">
          在波动中寻找内心的宁静
        </p>
      </div>

      {/* Philosophy Quotes */}
      <div className="max-w-md mx-auto mb-16 space-y-2 text-slate-500 font-mono text-sm opacity-80">
        <p>Market is Chaos.</p>
        <p>Mind is Stillness.</p>
        <p>Record the Bloom.</p>
      </div>

      {/* Enter Button */}
      <button
        onClick={onEnter}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="group relative px-8 py-4 bg-white/30 backdrop-blur-md border border-white/60 rounded-full text-slate-800 font-serif text-lg font-semibold tracking-wide transition-all duration-500 hover:bg-white/60 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,192,203,0.6)] flex items-center gap-3 overflow-hidden"
      >
        <span className="relative z-10 flex items-center gap-2">
          <Flower2 className={`transition-transform duration-700 ${isHovering ? 'rotate-180 text-pink-600' : 'text-slate-600'}`} size={20} />
          进入系统
          <ChevronRight className={`transition-transform duration-300 ${isHovering ? 'translate-x-1' : ''}`} size={20} />
        </span>
        
        {/* Button Hover Fill Effect */}
        <div className={`absolute inset-0 bg-gradient-to-r from-pink-100/50 to-white/50 transition-transform duration-500 ease-out origin-left ${isHovering ? 'scale-x-100' : 'scale-x-0'}`}></div>
      </button>

      {/* Footer */}
      <div className="absolute bottom-8 text-slate-400 text-xs font-light tracking-widest uppercase">
        Sakura Options Trading Journal © 2024
      </div>

      <style>{`
        @keyframes fadeInSlow {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-slow {
          animation: fadeInSlow 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;