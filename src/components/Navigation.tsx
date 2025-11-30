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
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <nav className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-full shadow-2xl px-2 py-2 flex gap-2 ring-1 ring-white/60">
        {navItems.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300
                ${isActive 
                  ? 'bg-slate-800 text-white shadow-lg transform scale-105 font-medium' 
                  : 'text-slate-500 hover:bg-white/50 hover:text-slate-800'
                }
              `}
            >
              {item.icon}
              <span className={`text-sm ${isActive ? 'block' : 'hidden sm:block'}`}>
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