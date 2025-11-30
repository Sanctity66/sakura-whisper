import React, { useMemo, memo } from 'react';
import { PlusCircle, Wallet, TrendingUp, XCircle, Hash, Calendar, Clock } from 'lucide-react';
import { OptionTrade } from '../types';

// 定义 Card 组件，避免重复定义
const Card = memo(({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}>
        {children}
    </div>
));

interface DashboardOverviewProps {
    trades: OptionTrade[];
    totalRealizedProfit: number;
    openPositionsCount: number;
    onRecordTrade: () => void;
    onClosePosition: (trade: OptionTrade) => void;
}

const DashboardOverview = memo(({
    trades,
    totalRealizedProfit,
    openPositionsCount,
    onRecordTrade,
    onClosePosition
}: DashboardOverviewProps) => {

    const getDaysToExpiration = (expDate: string) => {
        const today = new Date();
        const exp = new Date(expDate);
        const diffTime = exp.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const openTrades = useMemo(() => trades.filter(t => t.status === 'OPEN'), [trades]);

    return (
        <div className="w-full max-w-3xl mx-auto px-6 pt-24 pb-32 transform-gpu">
            {/* 1. 头部指标 - 无延迟 */}
            <div className="text-center mb-12 relative z-10 animate-float-in">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">总利润 (Total Realized P&L)</h2>
                <div
                    className={`text-6xl md:text-7xl font-serif font-bold tracking-tight transform-gpu will-change-transform ${totalRealizedProfit >= 0 ? 'text-slate-800' : 'text-rose-600'}`}
                >
                    {totalRealizedProfit >= 0 ? '+' : ''}{totalRealizedProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </div>
                <p className="mt-4 text-slate-600 font-light flex items-center justify-center gap-2">
                    <Wallet size={16} className="text-pink-500" />
                    <span>持仓中: {openPositionsCount} 笔</span>
                </p>
            </div>

            {/* 2. 操作栏 - 延迟 200ms */}
            <div className="flex justify-center mb-10 animate-float-in delay-200">
                <button
                    onClick={onRecordTrade}
                    className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-full font-bold shadow-lg hover:shadow-pink-200/50 hover:scale-105 transition-all flex items-center gap-2 overflow-hidden"
                >
                    <span className="relative z-10 flex items-center gap-2 text-lg">
                        <PlusCircle size={24} /> 记一笔交易
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
            </div>

            {/* 3. 持仓列表 - 延迟 400ms */}
            <section className="animate-float-in delay-[400ms]">
                <h3 className="text-lg font-serif font-bold text-slate-700 mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div> 持仓 (Open Positions)
                </h3>
                {openTrades.length > 0 ? (
                    <div className="space-y-4">
                        {openTrades.map((trade) => {
                            const dte = getDaysToExpiration(trade.expDate);
                            const isExpiringSoon = dte <= 7;

                            return (
                                <Card key={trade.id} className="relative overflow-hidden group">
                                    {/* 侧边装饰条 */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${trade.side === 'LONG' ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>

                                    <div className="p-5 flex flex-col gap-4">
                                        {/* 上半部分: 代码与主要详情 */}
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 font-serif font-bold text-2xl border border-slate-200 shadow-inner">
                                                    {trade.ticker[0]}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-bold text-slate-800 text-xl tracking-tight">{trade.ticker}</h4>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${trade.side === 'LONG' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                                            {trade.side}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
                                                        <TrendingUp size={14} className="text-pink-400" />
                                                        {trade.strategy}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => onClosePosition(trade)}
                                                className="px-4 py-2 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-full text-xs font-bold transition-all border border-slate-200 hover:border-rose-200 shadow-sm hover:shadow-md flex items-center gap-1.5"
                                            >
                                                <span>平仓</span>
                                                <XCircle size={14} />
                                            </button>
                                        </div>

                                        {/* 分割线 */}
                                        <div className="h-px bg-slate-100 w-full"></div>

                                        {/* 下半部分: 统计网格 */}
                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                            {/* 数量与价格 */}
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1">
                                                    <Hash size={10} /> 持仓成本
                                                </span>
                                                <span className="font-mono text-slate-700 font-medium">
                                                    {trade.quantity}x @ ${trade.entryPrice.toFixed(2)}
                                                </span>
                                            </div>

                                            {/* 到期日 */}
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1">
                                                    <Calendar size={10} /> 到期日
                                                </span>
                                                <span className="font-mono text-slate-700 font-medium">
                                                    {trade.expDate}
                                                </span>
                                            </div>

                                            {/* 剩余天数 (DTE) */}
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1">
                                                    <Clock size={10} /> 剩余天数
                                                </span>
                                                <span className={`font-mono font-bold ${dte <= 7 ? 'text-amber-500' : 'text-slate-700'}`}>
                                                    {dte} Days
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white/40 rounded-3xl border border-white/40 border-dashed flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mb-3">
                            <Wallet className="text-slate-300" size={32} />
                        </div>
                        <p className="text-slate-500 font-light">暂无持仓</p>
                        <p className="text-xs text-slate-400 mt-1">点击上方按钮开始记录</p>
                    </div>
                )}
            </section>
        </div>
    );
});

export default DashboardOverview;
