import { useState, useMemo, useCallback, useEffect } from 'react';
import { AppView, OptionTrade, TradeLogInput } from '../types';
import { processTradeLog, calculateTotalRealizedProfit } from '../utils/tradeCalculations';
import { loadTrades, saveTrades } from '../utils/storageUtils';
import { STORAGE_KEYS } from '../constants';

export const useDashboardLogic = () => {
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
        setCurrentView(AppView.DASHBOARD);
    }, []);

    const handleClosePositionClick = useCallback((trade: OptionTrade) => {
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
        setTrades(prevTrades => prevTrades.filter(t => t.id !== tradeId));
        console.log(`Deleted trade with ID: ${tradeId}`);
    }, []);

    const handleOpenRecordTrade = useCallback(() => {
        setPrefillTrade(null);
        setCurrentView(AppView.TRADE_FORM);
    }, []);

    const handleReturnToDashboard = useCallback(() => {
        setPrefillTrade(null);
        setCurrentView(AppView.DASHBOARD);
    }, []);

    return {
        currentView,
        setCurrentView,
        prefillTrade,
        setPrefillTrade,
        trades,
        totalRealizedProfit,
        openPositionsCount,
        handleSaveTrade,
        handleClosePositionClick,
        handleDeleteTrade,
        handleOpenRecordTrade,
        handleReturnToDashboard
    };
};
