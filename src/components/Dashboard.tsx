import React, { memo } from 'react';
import { ArrowLeft } from 'lucide-react';
import Navigation from './Navigation';
import JournalView from './JournalView';
import ProfitChart from './ProfitChart';
import DashboardOverview from './DashboardOverview';
import HistoryList from './HistoryList';
import { AppView } from '../types';
import { useDashboardLogic } from '../hooks/useDashboardLogic';

// --- 主组件 ---

const Dashboard: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    prefillTrade,
    trades,
    totalRealizedProfit,
    openPositionsCount,
    handleSaveTrade,
    handleClosePositionClick,
    handleDeleteTrade,
    handleOpenRecordTrade
  } = useDashboardLogic();

  return (
    <>
      {currentView !== AppView.TRADE_FORM && (
        <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex justify-between items-center bg-gradient-to-b from-white/80 via-white/40 to-transparent pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg">S</div>
            <span className="font-serif text-lg font-bold text-slate-800 tracking-tight">Sakura Ledger</span>
          </div>
        </header>
      )}

      <main className="relative z-10 w-full min-h-screen">
        {/* 交易表单视图 - 使用简单的淡入效果，因为它是模态视图 */}
        {currentView === AppView.TRADE_FORM && (
          <div className="relative animate-fade-in">
            <button
              onClick={() => {
                setCurrentView(AppView.DASHBOARD);
              }}
              className="fixed top-6 left-6 z-50 flex items-center gap-1 text-slate-600 hover:text-pink-600 transition-colors bg-white/80 px-4 py-2 rounded-full backdrop-blur-md shadow-sm border border-white/50 font-medium"
            >
              <ArrowLeft size={18} /> 返回
            </button>
            <JournalView
              onSave={handleSaveTrade}
              initialData={prefillTrade}
            />
          </div>
        )}

        {/* 主视图容器 - 显隐切换与优化动画 */}
        <div className={currentView === AppView.TRADE_FORM ? 'hidden' : 'block'}>
          <div key={currentView} className="animate-float-in">
            {/* 仪表板概览 */}
            <div className={currentView === AppView.DASHBOARD ? 'block' : 'hidden'}>
              <DashboardOverview
                trades={trades}
                totalRealizedProfit={totalRealizedProfit}
                openPositionsCount={openPositionsCount}
                onRecordTrade={handleOpenRecordTrade}
                onClosePosition={handleClosePositionClick}
              />
            </div>

            {/* 历史记录 */}
            <div className={currentView === AppView.HISTORY ? 'block' : 'hidden'}>
              <HistoryList
                trades={trades}
                onDeleteTrade={handleDeleteTrade}
              />
            </div>

            {/* 图表 */}
            <div className={currentView === AppView.CHARTS ? 'block' : 'hidden'}>
              <ProfitChart trades={trades} />
            </div>
          </div>
        </div>
      </main>

      {/* 底部导航 */}
      {currentView !== AppView.TRADE_FORM && (
        <Navigation currentView={currentView} onChangeView={setCurrentView} />
      )}
    </>
  );
};

export default memo(Dashboard);
