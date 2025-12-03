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
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 w-full flex justify-center pointer-events-none safe-area-inset-bottom">
      <nav className="pointer-events-auto bg-white/20 backdrop-blur-2xl border border-white/40 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] p-2 flex gap-2 ring-1 ring-white/40 transition-all duration-300 hover:bg-white/30">
        {navItems.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`
                group relative flex flex-col items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl transition-all duration-300 ease-out
                ${isActive
                  ? 'bg-white shadow-lg scale-110 -translate-y-2 text-pink-500'
                  : 'text-slate-600 hover:bg-white/40 hover:scale-110 hover:-translate-y-1'
                }
              `}
            >
              <div className="transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </div>

              {/* Active Indicator Dot */}
              {isActive && (
                <span className="absolute -bottom-3 w-1 h-1 bg-pink-500 rounded-full opacity-80"></span>
              )}

              {/* Tooltip Label (Desktop only) */}
              <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap hidden md:block">
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