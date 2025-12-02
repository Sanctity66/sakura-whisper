import React from 'react';
import { LayoutDashboard, History, LineChart } from 'lucide-react';
import { AppView, NavItem } from '../types';

interface MobileNavigationProps {
    currentView: AppView;
    onChangeView: (view: AppView) => void;
}

const navItems: NavItem[] = [
    { id: AppView.DASHBOARD, label: '概览', icon: <LayoutDashboard size={18} /> },
    { id: AppView.HISTORY, label: '历史', icon: <History size={18} /> },
    { id: AppView.CHARTS, label: '图表', icon: <LineChart size={18} /> },
];

const MobileNavigation: React.FC<MobileNavigationProps> = ({ currentView, onChangeView }) => {
    // 交易表单视图时，概览标签高亮
    const activeId = currentView === AppView.TRADE_FORM ? AppView.DASHBOARD : currentView;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[200] pointer-events-auto">
            <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-t from-white/40 to-transparent pointer-events-none"></div>
            <nav className="flex justify-around items-center px-3 py-2 safe-area-inset-bottom bg-white/30 backdrop-blur-xl border-t border-white/40 ring-1 ring-white/50 shadow-2xl">
                {navItems.map((item) => {
                    const isActive = activeId === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onChangeView(item.id)}
                            className={`
                flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 backdrop-blur-md
                ${isActive
                                    ? 'bg-white/30 text-slate-900 shadow-md ring-1 ring-white/60'
                                    : 'text-slate-600 active:bg-white/40'
                                }
              `}
                        >
                            {item.icon}
                            <span className="text-xs font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default MobileNavigation;
