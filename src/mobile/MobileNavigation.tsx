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
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-white/60 shadow-lg">
            <nav className="flex justify-around items-center px-2 py-2 safe-area-inset-bottom">
                {navItems.map((item) => {
                    const isActive = activeId === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onChangeView(item.id)}
                            className={`
                flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-all duration-200
                ${isActive
                                    ? 'bg-slate-800 text-white shadow-md'
                                    : 'text-slate-500 active:bg-slate-100'
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
