import React, { useMemo, memo } from 'react';
import { PlusCircle, Wallet, TrendingUp, XCircle, Hash, Calendar, Clock } from 'lucide-react';
import { OptionTrade } from '../types';

const Card = memo(({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white/70 backdrop-blur-xl border border-white/60 rounded-xl shadow-sm ${className}`}>
        {children}
    </div>
));

interface MobileOverviewProps {
    trades: OptionTrade[];
    totalRealizedProfit: number;
    openPositionsCount: number;
    onRecordTrade: () => void;
    onClosePosition: (trade: OptionTrade) => void;
}

const MobileOverview = memo(({
    trades,
    totalRealizedProfit,
    openPositionsCount,
    onRecordTrade,
    onClosePosition
}: MobileOverviewProps) => {

    const getDaysToExpiration = (expDate: string) => {
        const today = new Date();
        const exp = new Date(expDate);
        const diffTime = exp.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const openTrades = useMemo(() => trades.filter(t => t.status === 'OPEN'), [trades]);

    return (
        <div className="w-full px-4 pt-20 pb-24">
            {/* 头部指标 */}
            <div className="text-center mb-8">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    总利润
                </h2>
                <div
                    className={`text-4xl font-serif font-bold ${totalRealizedProfit >= 0 ? 'text-slate-800' : 'text-rose-600'}`}
                >
                    {totalRealizedProfit >= 0 ? '+' : ''}{totalRealizedProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </div>
                <p className="mt-3 text-slate-600 text-sm flex items-center justify-center gap-2">
                    <Wallet size={14} className="text-pink-500" />
                    <span>持仓中: {openPositionsCount} 笔</span>
                </p>
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-center mb-8">
                <button
                    onClick={onRecordTrade}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-full font-bold shadow-lg active:scale-95 transition-transform flex items-center gap-2"
                >
                    <PlusCircle size={20} />
                    <span>记一笔交易</span>
                </button>
            </div>

            {/* 持仓列表 */}
            <section>
                <h3 className="text-base font-serif font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    持仓
                </h3>
                {openTrades.length > 0 ? (
                    <div className="space-y-3">
                        {openTrades.map((trade) => {
                            const dte = getDaysToExpiration(trade.expDate);

                            return (
                                <Card key={trade.id} className="relative overflow-hidden">
                                    {/* 侧边装饰条 */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${trade.side === 'LONG' ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>

                                    <div className="p-4 flex flex-col gap-3">
                                        {/* 标题行 */}
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-700 font-serif font-bold text-xl border border-slate-200">
                                                    {trade.ticker[0]}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-bold text-slate-800 text-lg">{trade.ticker}</h4>
                                                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${trade.side === 'LONG' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                            {trade.side}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                                        <TrendingUp size={12} className="text-pink-400" />
                                                        {trade.strategy}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => onClosePosition(trade)}
                                                className="px-3 py-1.5 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-full text-xs font-bold transition-colors border border-slate-200 flex items-center gap-1"
                                            >
                                                <span>平仓</span>
                                                <XCircle size={12} />
                                            </button>
                                        </div>

                                        {/* 分割线 */}
                                        <div className="h-px bg-slate-100 w-full"></div>

                                        {/* 详情网格 */}
                                        <div className="grid grid-cols-3 gap-2 text-xs">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-0.5">
                                                    <Hash size={9} /> 成本
                                                </span>
                                                <span className="font-mono text-slate-700 font-medium">
                                                    {trade.quantity}x @ ${trade.entryPrice.toFixed(2)}
                                                </span>
                                            </div>

                                            <div className="flex flex-col">
                                                <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-0.5">
                                                    <Calendar size={9} /> 到期
                                                </span>
                                                <span className="font-mono text-slate-700 font-medium text-[11px]">
                                                    {trade.expDate}
                                                </span>
                                            </div>

                                            <div className="flex flex-col items-end">
                                                <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-0.5">
                                                    <Clock size={9} /> 剩余
                                                </span>
                                                <span className={`font-mono font-bold ${dte <= 7 ? 'text-amber-500' : 'text-slate-700'}`}>
                                                    {dte}天
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-white/40 rounded-2xl border border-white/40 border-dashed flex flex-col items-center justify-center">
                        <div className="w-14 h-14 bg-white/50 rounded-full flex items-center justify-center mb-2">
                            <Wallet className="text-slate-300" size={28} />
                        </div>
                        <p className="text-slate-500 text-sm">暂无持仓</p>
                        <p className="text-xs text-slate-400 mt-1">点击上方按钮开始记录</p>
                    </div>
                )}
            </section>
        </div>
    );
});

export default MobileOverview;
