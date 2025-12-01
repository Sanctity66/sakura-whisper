import React, { memo } from 'react';
import { ArrowLeft } from 'lucide-react';
import MobileNavigation from './MobileNavigation';
import MobileOverview from './MobileOverview';
import JournalView from '../components/JournalView';
import HistoryList from '../components/HistoryList';
import ProfitChart from '../components/ProfitChart';
import { AppView } from '../types';
import { useDashboardLogic } from '../hooks/useDashboardLogic';

const MobileDashboard: React.FC = () => {
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
        handleOpenRecordTrade,
        handleReturnToDashboard
    } = useDashboardLogic();

    return (
        <>
            {/* 头部 */}
            {currentView !== AppView.TRADE_FORM && (
                <header className="fixed top-0 left-0 right-0 z-40 px-4 py-3 flex justify-between items-center bg-gradient-to-b from-white/90 via-white/50 to-transparent backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-pink-500 flex items-center justify-center text-white font-serif font-bold text-lg shadow-md">S</div>
                        <span className="font-serif text-base font-bold text-slate-800 tracking-tight">Sakura Ledger</span>
                    </div>
                </header>
            )}

            <main className="relative z-10 w-full min-h-screen">
                {/* 交易表单视图 */}
                {currentView === AppView.TRADE_FORM && (
                    <div className="relative">
                        <button
                            onClick={handleReturnToDashboard}
                            className="fixed top-4 left-4 z-50 flex items-center gap-1 text-slate-600 active:text-pink-600 transition-colors bg-white/80 px-3 py-2 rounded-full backdrop-blur-md shadow-sm border border-white/50 font-medium"
                        >
                            <ArrowLeft size={16} /> 返回
                        </button>
                        <JournalView
                            onSave={handleSaveTrade}
                            initialData={prefillTrade}
                        />
                    </div>
                )}

                {/* 主视图容器 */}
                <div className={currentView === AppView.TRADE_FORM ? 'hidden' : 'block'}>
                    {/* 仪表板概览 */}
                    <div className={currentView === AppView.DASHBOARD ? 'block' : 'hidden'}>
                        <MobileOverview
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
            </main>

            {/* 底部导航 */}
            {currentView !== AppView.TRADE_FORM && (
                <MobileNavigation currentView={currentView} onChangeView={setCurrentView} />
            )}
        </>
    );
};

export default memo(MobileDashboard);
