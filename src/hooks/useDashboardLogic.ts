import { useState, useMemo, useCallback, useEffect } from 'react';
import { AppView, OptionTrade, TradeLogInput } from '../types';
import { processTradeLog, calculateTotalRealizedProfit } from '../utils/tradeCalculations';
import { api } from '../services/api';

export const useDashboardLogic = () => {
    const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
    const [prefillTrade, setPrefillTrade] = useState<Partial<TradeLogInput> | null>(null);

    const [trades, setTrades] = useState<OptionTrade[]>([]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const remote = await api.fetchTrades();
                if (mounted) setTrades(remote);
            } catch (e) {
                console.error('Failed to fetch trades from API:', e);
            }
        })();
        return () => { mounted = false; };
    }, []);

    // 同步到后端：在具体操作中进行差异保存

    // 派生指标
    const totalRealizedProfit = useMemo(() => {
        return calculateTotalRealizedProfit(trades);
    }, [trades]);

    const openPositionsCount = useMemo(() => {
        return trades.filter(t => t.status === 'OPEN').length;
    }, [trades]);

    // 处理新交易日志（开仓或平仓）
    const handleSaveTrade = useCallback((input: TradeLogInput) => {
        setTrades(prevTrades => {
            const next = processTradeLog(input, prevTrades);
            // 差异保存：新建或更新的记录发送到后端
            const prevMap = new Map(prevTrades.map(t => [t.id, t]));
            const changed = next.filter(t => {
                const prev = prevMap.get(t.id);
                if (!prev) return true;
                return JSON.stringify(prev) !== JSON.stringify(t);
            });
            changed.forEach(t => {
                api.saveTrade(t).catch(err => console.error('saveTrade failed', err));
            });
            setPrefillTrade(null);
            setCurrentView(AppView.DASHBOARD);
            return next;
        });
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
        api.deleteTrade(tradeId).catch(err => console.error('deleteTrade failed', err));
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
