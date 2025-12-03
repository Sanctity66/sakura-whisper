import React, { useMemo, memo } from 'react';
import { History, ArrowUpRight, ArrowDownLeft, Trash2 } from 'lucide-react';
import { OptionTrade } from '../types';

// 定义 Card 组件，避免重复定义 (理想情况下应提取为公共组件)
const Card = memo(({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}>
        {children}
    </div>
));

interface HistoryListProps {
    trades: OptionTrade[];
    onDeleteTrade: (id: string) => void;
}

const HistoryList = memo(({ trades, onDeleteTrade }: HistoryListProps) => {
    const closedTrades = useMemo(() => trades.filter(t => t.status === 'CLOSED'), [trades]);

    return (
        <div className="w-full max-w-3xl mx-auto px-6 pt-24 pb-32 transform-gpu">
            {/* 1. 头部 - 无延迟 */}
            <div className="mb-8 flex items-center justify-between animate-float-in">
                <h1 className="text-2xl font-serif font-bold text-slate-800 flex items-center gap-2">
                    <History size={24} className="text-pink-500" /> 交易历史 (History)
                </h1>
                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/60 shadow-sm">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Closed</span>
                    <span className="text-xl font-serif font-bold text-slate-800">{closedTrades.length}</span>
                </div>
            </div>

            {/* 2. 列表 - 延迟 200ms */}
            <div className="space-y-3 animate-float-in delay-200">
                {closedTrades.map((trade) => (
                    <Card key={trade.id} className="p-4 md:p-5 flex flex-row items-center justify-between group hover:bg-white/90">
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-md transition-transform group-hover:scale-110 ${trade.pnl >= 0 ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 'bg-gradient-to-br from-rose-400 to-rose-600'}`}>
                                {trade.pnl >= 0 ? <ArrowUpRight size={20} className="md:w-6 md:h-6" /> : <ArrowDownLeft size={20} className="md:w-6 md:h-6" />}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-base md:text-lg">{trade.ticker} <span className="text-slate-400 font-normal text-xs md:text-sm hidden sm:inline">/ {trade.strategy}</span></h4>
                                <div className="sm:hidden text-xs text-slate-400">{trade.strategy}</div>
                                <p className="text-xs text-slate-500 mt-0.5 md:mt-1 flex items-center gap-2">
                                    <span>{trade.closeDate}</span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <span>Qty: {trade.quantity}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 md:gap-4">
                            <div className="flex flex-col items-end">
                                <p className={`font-mono text-base md:text-xl font-bold ${trade.pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                </p>
                                <p className="text-[10px] md:text-xs text-slate-400 hidden sm:block">
                                    ${trade.entryPrice.toFixed(2)} &rarr; ${trade.closePrice?.toFixed(2)}
                                </p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteTrade(trade.id);
                                }}
                                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all group-hover/btn:scale-110"
                                title="删除记录"
                            >
                                <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                            </button>
                        </div>
                    </Card>
                ))}
                {closedTrades.length === 0 && (
                    <div className="text-center py-20 text-slate-400 font-light italic bg-white/40 rounded-3xl border border-white/50">
                        暂无历史交易记录
                    </div>
                )}
            </div>
        </div>
    );
});

export default HistoryList;
