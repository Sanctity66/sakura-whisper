import React from 'react';
import { LayoutDashboard, History, LineChart } from 'lucide-react';
import { AppView, NavItem } from '../types';

interface NavigationProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

const navItems: NavItem[] = [
  { id: AppView.DASHBOARD, label: '概览', icon: <LayoutDashboard size={20} /> },
  { id: AppView.HISTORY, label: '历史', icon: <History size={20} /> },
  { id: AppView.CHARTS, label: '图表', icon: <LineChart size={20} /> },
];

const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView }) => {
  // When in form view, we consider Dashboard active (conceptually parent)
  const activeId = currentView === AppView.TRADE_FORM ? AppView.DASHBOARD : currentView;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex justify-center pointer-events-none safe-area-inset-bottom w-auto">
      <nav className="pointer-events-auto flex items-center gap-3 px-4 py-3 bg-white/20 backdrop-blur-3xl border border-white/30 rounded-[2rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.2)] ring-1 ring-white/30 transition-all duration-300 hover:bg-white/30 hover:scale-105">
        {navItems.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className="group relative flex flex-col items-center justify-center transition-all duration-300 ease-out"
            >
              {/* Icon Container (Squircle) */}
              <div className={`
                w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-2xl transition-all duration-300 shadow-sm
                ${isActive
                  ? 'bg-gradient-to-br from-white to-slate-100 text-pink-500 shadow-lg scale-110 -translate-y-2'
                  : 'bg-white/40 text-slate-600 hover:bg-white/80 hover:scale-110 hover:-translate-y-1'
                }
              `}>
                {item.icon}
              </div>

              {/* Active Indicator Dot (iOS style below icon) */}
              <span className={`
                absolute -bottom-2 w-1 h-1 bg-slate-400 rounded-full transition-all duration-300
                ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
              `}></span>

              {/* Tooltip Label (Desktop only) */}
              <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1.5 bg-slate-800/90 backdrop-blur-md text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap hidden md:block shadow-xl translate-y-2 group-hover:translate-y-0">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Navigation;