/**
 * 交易计算工具函数
 * 包含期权交易相关的各种计算逻辑
 */

import { OptionTrade, TradeLogInput } from '../types';
import { compareDates } from './dateUtils';

/**
 * 计算单笔交易的盈亏
 * @param entryPrice - 开仓价格
 * @param closePrice - 平仓价格
 * @param quantity - 数量
 * @param side - 方向 (LONG/SHORT)
 * @returns 盈亏金额
 */
export const calculatePnL = (
    entryPrice: number,
    closePrice: number,
    quantity: number,
    side: 'LONG' | 'SHORT'
): number => {
    const priceDiff = closePrice - entryPrice;
    const multiplier = side === 'LONG' ? 1 : -1;
    return priceDiff * quantity * multiplier;
};

/**
 * 计算总已实现盈亏
 * @param trades - 交易记录数组
 * @returns 总已实现盈亏
 */
export const calculateTotalRealizedProfit = (trades: OptionTrade[]): number => {
    return trades
        .filter(t => t.status === 'CLOSED')
        .reduce((sum, t) => sum + t.pnl, 0);
};

/**
 * 计算未实现盈亏（需要当前市场价格）
 * @param trades - 持仓交易数组
 * @param currentPrices - 当前市场价格映射 {ticker: price}
 * @returns 总未实现盈亏
 */
export const calculateUnrealizedPnL = (
    trades: OptionTrade[],
    currentPrices: Record<string, number>
): number => {
    return trades
        .filter(t => t.status === 'OPEN')
        .reduce((sum, t) => {
            const currentPrice = currentPrices[t.ticker];
            if (currentPrice === undefined) return sum;

            const unrealizedPnL = calculatePnL(
                t.entryPrice,
                currentPrice,
                t.quantity,
                t.side
            );
            return sum + unrealizedPnL;
        }, 0);
};

/**
 * 统计交易绩效指标
 */
export interface TradeMetrics {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
    avgWin: number;
    avgLoss: number;
    grossWin: number;
    grossLoss: number;
}

/**
 * 计算交易统计指标
 * @param trades - 已平仓交易数组
 * @returns 交易统计指标
 */
export const calculateTradeMetrics = (trades: OptionTrade[]): TradeMetrics => {
    // 只统计已平仓交易
    const closedTrades = trades
        .filter(t => t.status === 'CLOSED' && t.closeDate)
        .sort((a, b) => compareDates(a.closeDate!, b.closeDate!));

    let runningTotal = 0;
    let peakTotal = 0;
    let maxDrawdown = 0;
    let grossWin = 0;
    let grossLoss = 0;

    // 计算回撤和总盈亏
    closedTrades.forEach(trade => {
        runningTotal += trade.pnl;

        // 更新峰值
        if (runningTotal > peakTotal) {
            peakTotal = runningTotal;
        }

        // 计算当前回撤
        const drawdown = peakTotal - runningTotal;
        if (drawdown > maxDrawdown) {
            maxDrawdown = drawdown;
        }

        // 累计盈亏
        if (trade.pnl > 0) {
            grossWin += trade.pnl;
        } else {
            grossLoss += Math.abs(trade.pnl);
        }
    });

    const totalTrades = closedTrades.length;
    const winningTrades = closedTrades.filter(t => t.pnl > 0).length;
    const losingTrades = closedTrades.filter(t => t.pnl <= 0).length;

    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    const profitFactor = grossLoss > 0 ? grossWin / grossLoss : (grossWin > 0 ? Infinity : 0);
    const avgWin = winningTrades > 0 ? grossWin / winningTrades : 0;
    const avgLoss = losingTrades > 0 ? grossLoss / losingTrades : 0;

    return {
        totalTrades,
        winningTrades,
        losingTrades,
        winRate,
        profitFactor,
        maxDrawdown,
        avgWin,
        avgLoss,
        grossWin,
        grossLoss,
    };
};

/**
 * 生成唯一交易ID
 * @returns 唯一ID字符串
 */
export const generateTradeId = (): string => {
    return `trade_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
};

/**
 * 从交易输入创建新的期权交易记录
 * @param input - 交易输入数据
 * @returns 新的交易记录
 */
export const createTradeFromInput = (input: TradeLogInput): OptionTrade => {
    const side: 'LONG' | 'SHORT' = input.action === 'BUY' ? 'LONG' : 'SHORT';

    return {
        id: generateTradeId(),
        ticker: input.ticker,
        strategy: input.strategy,
        expDate: input.expDate,
        side,
        quantity: input.quantity,
        entryPrice: input.price,
        entryDate: input.date,
        status: 'OPEN',
        pnl: 0,
        notes: input.notes,
    };
};

/**
 * 平仓交易
 * @param trade - 要平仓的交易
 * @param closePrice - 平仓价格
 * @param closeDate - 平仓日期
 * @returns 更新后的交易记录
 */
export const closeTrade = (
    trade: OptionTrade,
    closePrice: number,
    closeDate: string
): OptionTrade => {
    const pnl = calculatePnL(
        trade.entryPrice,
        closePrice,
        trade.quantity,
        trade.side
    );

    return {
        ...trade,
        status: 'CLOSED',
        closePrice,
        closeDate,
        pnl,
    };
};

/**
 * 处理交易日志输入，更新交易记录列表
 * 处理开仓、平仓（全平/部分平仓）逻辑
 * @param input - 交易输入数据
 * @param currentTrades - 当前交易记录列表
 * @returns 更新后的交易记录列表
 */
export const processTradeLog = (
    input: TradeLogInput,
    currentTrades: OptionTrade[]
): OptionTrade[] => {
    const { ticker, strategy, expDate, action, price, quantity, date, notes } = input;

    // 查找匹配的持仓 (OPEN position)
    const matchIndex = currentTrades.findIndex(t =>
        t.status === 'OPEN' &&
        t.ticker.toUpperCase() === ticker.toUpperCase() &&
        t.strategy === strategy &&
        t.expDate === expDate
    );

    if (matchIndex !== -1) {
        const existing = currentTrades[matchIndex];
        // 判断是否为平仓操作：方向相反即为平仓
        // LONG持仓 + SELL操作 = 平仓
        // SHORT持仓 + BUY操作 = 平仓
        const isClosing = (existing.side === 'LONG' && action === 'SELL') ||
            (existing.side === 'SHORT' && action === 'BUY');

        if (isClosing) {
            // 计算平仓盈亏
            // LONG: (卖出价 - 买入价) * 数量 * 100 (合约乘数)
            // SHORT: (卖出价 - 买入价) * 数量 * -1 * 100 (合约乘数) -> (买入价 - 卖出价) * 数量 * 100
            // 注意：这里假设期权合约乘数为100，如果不是需调整
            // calculatePnL 函数已经处理了 multiplier，但通常期权价格是单股价格，一手=100股
            // 这里的 priceDiff 是单股盈亏
            const priceDiff = existing.side === 'LONG'
                ? (price - existing.entryPrice)
                : (existing.entryPrice - price);

            const closeQty = Math.min(quantity, existing.quantity);
            // 期权通常一手100股，这里默认乘100。如果应用场景不同需调整。
            // 原有逻辑中有 * 100，这里保持一致。
            const profit = priceDiff * closeQty * 100;

            const newTrades = [...currentTrades];

            // 情况 1: 全部平仓
            if (existing.quantity === closeQty) {
                newTrades[matchIndex] = {
                    ...existing,
                    status: 'CLOSED',
                    closePrice: price,
                    closeDate: date,
                    pnl: profit,
                    notes: notes ? (existing.notes + '\n' + notes) : existing.notes
                };
            }
            // 情况 2: 部分平仓
            else {
                // 更新原持仓数量
                newTrades[matchIndex] = {
                    ...existing,
                    quantity: existing.quantity - closeQty
                };
                // 创建新的已平仓记录
                const closedPart: OptionTrade = {
                    ...existing,
                    id: generateTradeId(), // 生成新ID
                    quantity: closeQty,
                    status: 'CLOSED',
                    closePrice: price,
                    closeDate: date,
                    pnl: profit,
                    notes: notes ? (existing.notes + '\n' + notes) : existing.notes
                };
                // 将新平仓记录插入到列表头部
                newTrades.unshift(closedPart);
            }
            return newTrades;
        }
    }

    // 如果没有匹配持仓或不是平仓操作，则视为新开仓
    const newTrade: OptionTrade = createTradeFromInput(input);
    return [newTrade, ...currentTrades];
};
