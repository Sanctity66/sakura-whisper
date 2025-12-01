import React, { useState, useMemo, useCallback, memo, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Navigation from './Navigation';
import JournalView from './JournalView';
import ProfitChart from './ProfitChart';
import DashboardOverview from './DashboardOverview';
import HistoryList from './HistoryList';
import { AppView, OptionTrade, TradeLogInput } from '../types';
import { processTradeLog, calculateTotalRealizedProfit } from '../utils/tradeCalculations';
import { loadTrades, saveTrades } from '../utils/storageUtils';
import { STORAGE_KEYS } from '../constants';

// --- 主组件 ---

const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [prefillTrade, setPrefillTrade] = useState<Partial<TradeLogInput> | null>(null);

  // 交易记录状态
  // 初始化时尝试从 localStorage 加载数据
  const [trades, setTrades] = useState<OptionTrade[]>(() => {
    const savedTrades = loadTrades();
    if (savedTrades !== null) {
      return savedTrades;
    }

    // 检查是否是首次启动
    // 如果不是首次启动但没有数据 (savedTrades === null)，说明数据被清空了，应该返回空数组而不是默认数据
    const hasLaunched = localStorage.getItem(STORAGE_KEYS.HAS_LAUNCHED);
    if (hasLaunched) {
      return [];
    }

    // 如果没有保存的数据且是首次启动，使用默认的示例数据
    return [
      {
        id: '1',
        ticker: 'SPX',
        strategy: 'Iron Condor',
        expDate: '2024-05-17',
        side: 'SHORT',
        quantity: 1,
        entryPrice: 10.50,
        entryDate: '2024-04-20',
        status: 'OPEN',
        pnl: 0
      },
      {
        id: '4',
        ticker: 'AAPL',
        strategy: 'Call',
        expDate: '2024-05-24',
        side: 'LONG',
        quantity: 3,
        entryPrice: 3.20,
        entryDate: '2024-04-22',
        status: 'OPEN',
        pnl: 0
      },
      {
        id: '2',
        ticker: 'NVDA',
        strategy: 'Put',
        expDate: '2024-05-10',
        side: 'SHORT',
        quantity: 1,
        entryPrice: 5.20,
        entryDate: '2024-04-15',
        status: 'CLOSED',
        closePrice: 1.20,
        closeDate: '2024-05-01',
        pnl: 400
      },
      {
        id: '3',
        ticker: 'TSLA',
        strategy: 'Call',
        expDate: '2024-04-20',
        side: 'LONG',
        quantity: 2,
        entryPrice: 2.50,
        entryDate: '2024-04-01',
        status: 'CLOSED',
        closePrice: 4.00,
        closeDate: '2024-04-18',
        pnl: 300
      }
    ];
  });

  // 首次加载时设置启动标记
  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEYS.HAS_LAUNCHED)) {
      localStorage.setItem(STORAGE_KEYS.HAS_LAUNCHED, 'true');
    }
  }, []);

  // 当 trades 发生变化时，保存到 localStorage
  useEffect(() => {
    saveTrades(trades);
  }, [trades]);

  // 派生指标
  const totalRealizedProfit = useMemo(() => {
    return calculateTotalRealizedProfit(trades);
  }, [trades]);

  const openPositionsCount = useMemo(() => {
    return trades.filter(t => t.status === 'OPEN').length;
  }, [trades]);

  // 处理新交易日志（开仓或平仓）
  const handleSaveTrade = useCallback((input: TradeLogInput) => {
    setTrades(prevTrades => processTradeLog(input, prevTrades));
    setPrefillTrade(null);
    // 使用 handleViewChange 确保过渡效果，或者直接切换
    setCurrentView(AppView.DASHBOARD);
  }, []);

  const handleClosePositionClick = useCallback((trade: OptionTrade) => {
    // 根据持仓方向确定正确的平仓动作
    // LONG 持仓 (买入) 通过 SELL 平仓
    // SHORT 持仓 (卖出) 通过 BUY 平仓
    const closeAction = trade.side === 'LONG' ? 'SELL' : 'BUY';

    setPrefillTrade({
      ticker: trade.ticker,
      strategy: trade.strategy,
      expDate: trade.expDate,
      action: closeAction,
      quantity: trade.quantity,
    });
    setCurrentView(AppView.TRADE_FORM);
  }, []);

  const handleDeleteTrade = useCallback((tradeId: string) => {
    // 直接删除交易记录
    setTrades(prevTrades => prevTrades.filter(t => t.id !== tradeId));
    console.log(`Deleted trade with ID: ${tradeId}`);
  }, []);

  const handleOpenRecordTrade = useCallback(() => {
    setPrefillTrade(null);
    setCurrentView(AppView.TRADE_FORM);
  }, []);

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
                setPrefillTrade(null);
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