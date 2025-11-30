import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Percent, Activity, ArrowDownRight, Scale } from 'lucide-react';
import { OptionTrade } from '../types';

interface ProfitChartProps {
  trades: OptionTrade[];
}

const ProfitChart: React.FC<ProfitChartProps> = ({ trades }) => {
  // Process data: Filter closed trades, sort by date, calculate cumulative P&L
  const { chartData, metrics } = useMemo(() => {
    const closedTrades = trades
      .filter(t => t.status === 'CLOSED' && t.closeDate)
      .sort((a, b) => new Date(a.closeDate!).getTime() - new Date(b.closeDate!).getTime());

    let runningTotal = 0;
    let peakTotal = -Infinity;
    let maxDrawdown = 0;
    let grossWin = 0;
    let grossLoss = 0;

    const points = closedTrades.map(t => {
      runningTotal += t.pnl;
      
      // Drawdown calc
      if (runningTotal > peakTotal) peakTotal = runningTotal;
      const drawDown = peakTotal - runningTotal;
      if (drawDown > maxDrawdown) maxDrawdown = drawDown;

      // Win/Loss stats
      if (t.pnl > 0) grossWin += t.pnl;
      else grossLoss += Math.abs(t.pnl);

      return {
        date: t.closeDate!,
        value: runningTotal,
        tradePnl: t.pnl,
        ticker: t.ticker
      };
    });

    // Add initial point
    if (points.length > 0) {
       points.unshift({ date: 'Start', value: 0, tradePnl: 0, ticker: '' });
       if (0 > peakTotal) peakTotal = 0; // handle start
    }

    const totalTrades = closedTrades.length;
    const winningTrades = closedTrades.filter(t => t.pnl > 0).length;
    const losingTrades = closedTrades.filter(t => t.pnl <= 0).length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    const profitFactor = grossLoss > 0 ? grossWin / grossLoss : grossWin > 0 ? Infinity : 0;
    const avgWin = winningTrades > 0 ? grossWin / winningTrades : 0;
    const avgLoss = losingTrades > 0 ? grossLoss / losingTrades : 0;

    return {
      chartData: points,
      metrics: {
        totalTrades,
        winningTrades,
        losingTrades,
        winRate,
        profitFactor,
        maxDrawdown,
        avgWin,
        avgLoss,
        grossWin,
        grossLoss
      }
    };
  }, [trades]);

  if (chartData.length < 2) {
    return (
      <div className="w-full max-w-3xl mx-auto px-6 pt-24 pb-32 transform-gpu text-center animate-float-in">
         <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl p-12 shadow-sm">
             <div className="text-slate-400 mb-4">
                 <TrendingUp size={48} className="mx-auto opacity-50" />
             </div>
             <h2 className="text-xl font-serif text-slate-600">暂无足够数据</h2>
             <p className="text-slate-500 font-light mt-2">请先记录至少一笔已平仓的交易以生成趋势图。</p>
         </div>
      </div>
    );
  }

  // Chart Dimensions
  const width = 800;
  const height = 400;
  const padding = 40;

  // Scales with Visual Buffer
  const values = chartData.map(d => d.value);
  const minData = Math.min(0, ...values);
  const maxData = Math.max(0, ...values);
  const dataRange = maxData - minData || 100;
  
  // Add 15% padding to top and bottom for better visual breathing room
  const domainMin = minData - (dataRange * 0.15);
  const domainMax = maxData + (dataRange * 0.15);
  const domainRange = domainMax - domainMin;

  const getY = (val: number) => {
    return height - padding - ((val - domainMin) / domainRange) * (height - padding * 2);
  };

  const getX = (index: number) => {
    return padding + (index / (chartData.length - 1)) * (width - padding * 2);
  };

  // SVG Path generation
  const pathD = chartData.map((d, i) => 
    `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.value)}`
  ).join(' ');

  // Gradient Area Path
  const areaPathD = `
    ${pathD}
    L ${getX(chartData.length - 1)} ${height - padding}
    L ${padding} ${height - padding}
    Z
  `;

  // Zero line Y position
  const zeroY = getY(0);

  const totalPnl = chartData[chartData.length - 1].value;
  const isPositive = totalPnl >= 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6 pt-24 pb-32 transform-gpu">
        {/* 1. Header - No Delay */}
        <div className="mb-8 text-center animate-float-in">
            <h1 className="text-2xl font-serif font-bold text-slate-800 mb-1 flex items-center justify-center gap-2">
               利润曲线 (Profit Curve)
            </h1>
            <p className={`text-4xl font-mono font-bold tracking-tight ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isPositive ? '+' : ''}{totalPnl.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </p>
        </div>

        {/* 2. Chart Container - Delay 200ms */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl p-4 md:p-8 relative overflow-hidden mb-8 animate-float-in delay-200">
             <div className="relative w-full overflow-hidden" style={{ paddingBottom: '50%' }}>
                <svg 
                    viewBox={`0 0 ${width} ${height}`} 
                    className="absolute inset-0 w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id="gradientFill" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity="0.2" />
                            <stop offset="100%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
                        const y = padding + ratio * (height - padding * 2);
                        return (
                            <line key={ratio} x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e2e8f0" strokeDasharray="4" />
                        );
                    })}

                    {/* Zero Line */}
                    <line x1={padding} y1={zeroY} x2={width - padding} y2={zeroY} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />

                    {/* Area Fill */}
                    <path d={areaPathD} fill="url(#gradientFill)" />

                    {/* Main Line */}
                    <path 
                        d={pathD} 
                        fill="none" 
                        stroke={isPositive ? '#10b981' : '#f43f5e'} 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    />

                    {/* Data Points */}
                    {chartData.map((d, i) => (
                        <g key={i} className="group">
                             <circle 
                                cx={getX(i)} 
                                cy={getY(d.value)} 
                                r="4" 
                                fill="white" 
                                stroke={isPositive ? '#10b981' : '#f43f5e'} 
                                strokeWidth="2"
                                className="transition-all duration-300 group-hover:r-6 cursor-pointer"
                            />
                            {/* Tooltip */}
                            <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                <rect 
                                    x={getX(i) - 70} 
                                    y={getY(d.value) - 65} 
                                    width="140" 
                                    height="55" 
                                    rx="8" 
                                    fill="#1e293b" 
                                    filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
                                />
                                <text 
                                    x={getX(i)} 
                                    y={getY(d.value) - 35} 
                                    fill="white" 
                                    textAnchor="middle" 
                                    fontSize="14" 
                                    fontWeight="bold"
                                    fontFamily="monospace"
                                >
                                    ${d.value.toLocaleString()}
                                </text>
                                <text 
                                    x={getX(i)} 
                                    y={getY(d.value) - 18} 
                                    fill="#94a3b8" 
                                    textAnchor="middle" 
                                    fontSize="11"
                                >
                                    {d.date}
                                </text>
                            </g>
                        </g>
                    ))}
                </svg>
             </div>
             <div className="flex justify-between px-2 mt-4 text-xs text-slate-400 font-mono">
                 <span>{chartData[0].date}</span>
                 <span>{chartData[chartData.length - 1].date}</span>
             </div>
        </div>
        
        {/* 3. Advanced Metrics Grid - Delay 400ms */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-float-in delay-[400ms]">
             {/* Win Rate */}
             <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white/50 shadow-sm flex flex-col items-center">
                 <div className="mb-2 p-2 bg-pink-100 rounded-full text-pink-500">
                    <Percent size={20} />
                 </div>
                 <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">胜率 (Win Rate)</p>
                 <p className="text-2xl font-bold text-slate-800">
                     {metrics.winRate.toFixed(1)}<span className="text-sm text-slate-500">%</span>
                 </p>
                 <p className="text-[10px] text-slate-400 mt-1">
                    {metrics.winningTrades}W - {metrics.losingTrades}L
                 </p>
             </div>

             {/* Profit Factor */}
             <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white/50 shadow-sm flex flex-col items-center">
                 <div className="mb-2 p-2 bg-indigo-100 rounded-full text-indigo-500">
                    <Scale size={20} />
                 </div>
                 <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">盈亏比 (PF)</p>
                 <p className={`text-2xl font-bold ${metrics.profitFactor >= 1.5 ? 'text-emerald-600' : 'text-slate-800'}`}>
                     {metrics.profitFactor === Infinity ? '∞' : metrics.profitFactor.toFixed(2)}
                 </p>
                 <p className="text-[10px] text-slate-400 mt-1">
                    Gross: ${metrics.grossWin.toLocaleString()}
                 </p>
             </div>

             {/* Max Drawdown */}
             <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white/50 shadow-sm flex flex-col items-center">
                 <div className="mb-2 p-2 bg-rose-100 rounded-full text-rose-500">
                    <ArrowDownRight size={20} />
                 </div>
                 <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">最大回撤 (Max DD)</p>
                 <p className="text-2xl font-bold text-rose-600">
                     -${metrics.maxDrawdown.toLocaleString()}
                 </p>
                 <p className="text-[10px] text-slate-400 mt-1">
                    Peak to Trough
                 </p>
             </div>

             {/* Avg Win / Loss */}
             <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-white/50 shadow-sm flex flex-col items-center">
                 <div className="mb-2 p-2 bg-emerald-100 rounded-full text-emerald-500">
                    <Activity size={20} />
                 </div>
                 <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">平均盈亏 (Avg P&L)</p>
                 <div className="flex flex-col items-center">
                     <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                        <TrendingUp size={12} /> ${Math.round(metrics.avgWin)}
                     </span>
                     <span className="text-sm font-bold text-rose-600 flex items-center gap-1">
                        <TrendingDown size={12} /> ${Math.round(metrics.avgLoss)}
                     </span>
                 </div>
             </div>
        </div>
    </div>
  );
};

export default ProfitChart;