import React, { useState, useEffect } from 'react';
import { Save, Calendar, DollarSign, TrendingUp, Hash, ArrowUpCircle, ArrowDownCircle, ChevronDown, Calendar as CalendarIcon, Layers } from 'lucide-react';
import { TradeLogInput } from '../types';

interface JournalViewProps {
    onSave?: (trade: TradeLogInput) => void;
    initialData?: Partial<TradeLogInput> | null;
}

interface TickerInputProps {
    value: string;
    onChange: (value: string) => void;
}

const TickerInput: React.FC<TickerInputProps> = ({ value, onChange }) => {
    const [isComposing, setIsComposing] = useState(false);

    const handleCompositionStart = () => {
        setIsComposing(true);
    };

    const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
        setIsComposing(false);
        onChange(e.currentTarget.value.toUpperCase());
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (!isComposing) {
            onChange(val.toUpperCase());
        } else {
            onChange(val);
        }
    };

    return (
        <input
            id="ticker"
            required
            type="text"
            className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300/50 font-mono text-lg font-bold text-slate-800 placeholder-slate-300 uppercase transition-all hover:bg-white/80"
            placeholder="SPX"
            value={value}
            onChange={handleChange}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            title="Ticker Symbol"
        />
    );
};

const JournalView: React.FC<JournalViewProps> = ({ onSave, initialData }) => {
    const [formData, setFormData] = useState<Partial<TradeLogInput>>({
        action: 'BUY',
        quantity: 1,
        date: new Date().toISOString().split('T')[0]
    });

    // Populate form when initialData is provided
    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                ...initialData,
                // Keep today's date if not provided in initialData, or override if needed
                date: initialData.date || new Date().toISOString().split('T')[0]
            }));
        } else {
            // Reset to default if explicitly null (optional, depending on flow)
            setFormData({
                action: 'BUY',
                quantity: 1,
                date: new Date().toISOString().split('T')[0]
            });
        }
    }, [initialData]);

    const handleChange = (field: keyof TradeLogInput, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSave && formData.ticker && formData.strategy && formData.expDate && formData.price) {
            onSave(formData as TradeLogInput);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto px-6 pt-24 pb-32 animate-fade-in">
            <style>{`
          /* Custom Date Picker Styles to hide default icon but keep functionality */
          input[type="date"]::-webkit-calendar-picker-indicator {
            background: transparent;
            bottom: 0;
            color: transparent;
            cursor: pointer;
            height: auto;
            left: 0;
            position: absolute;
            right: 0;
            top: 0;
            width: auto;
            }
        `}</style>

            <div className="mb-8 text-center">
                <h1 className="text-3xl font-serif font-bold text-slate-800 mb-2">记录交易</h1>
                <p className="text-slate-600 font-light text-sm">若与现有持仓反向操作 (如持仓买入+记录卖出)，将自动结算利润并移入历史。</p>
            </div>

            <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl p-6 md:p-8 relative overflow-hidden">
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">

                    {/* Buy / Sell Toggle */}
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button
                            type="button"
                            onClick={() => handleChange('action', 'BUY')}
                            className={`flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${formData.action === 'BUY' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
                        >
                            <ArrowUpCircle size={18} /> 买入 (Buy)
                        </button>
                        <button
                            type="button"
                            onClick={() => handleChange('action', 'SELL')}
                            className={`flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${formData.action === 'SELL' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
                        >
                            <ArrowDownCircle size={18} /> 卖出 (Sell)
                        </button>
                    </div>

                    {/* Ticker (Full Width) */}
                    <div className="space-y-2">
                        <label htmlFor="ticker" className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <TrendingUp size={14} /> 标的 (Ticker)
                        </label>
                        <div className="relative">
                            <TickerInput
                                value={formData.ticker || ''}
                                onChange={(val) => handleChange('ticker', val)}
                            />
                        </div>
                    </div>

                    {/* Strategy & Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="strategy" className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Layers size={14} /> 策略 (Strategy)
                            </label>
                            <div className="relative group">
                                <select
                                    id="strategy"
                                    required
                                    className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-pink-300/50 text-lg text-slate-700 font-medium appearance-none cursor-pointer transition-all hover:bg-white/80"
                                    value={formData.strategy || ''}
                                    onChange={e => handleChange('strategy', e.target.value)}
                                    title="Strategy"
                                >
                                    <option value="" disabled>选择策略</option>
                                    <option value="Call">Call (看涨)</option>
                                    <option value="Put">Put (看跌)</option>
                                    <option value="Iron Condor">Iron Condor</option>
                                    <option value="Vertical Spread">Vertical Spread</option>
                                    <option value="Strangle">Strangle</option>
                                    <option value="Stock">Stock (正股)</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-pink-500 transition-colors">
                                    <ChevronDown size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="expDate" className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Calendar size={14} /> 到期日 (Exp Date)
                            </label>
                            <div className="relative group">
                                <input
                                    id="expDate"
                                    required
                                    type="date"
                                    className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300/50 text-lg text-slate-700 font-medium transition-all hover:bg-white/80 relative z-10"
                                    value={formData.expDate || ''}
                                    onChange={e => handleChange('expDate', e.target.value)}
                                    title="Expiration Date"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-pink-500 transition-colors z-20">
                                    <CalendarIcon size={20} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Qty */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="price" className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <DollarSign size={14} /> 价格 (Price)
                            </label>
                            <input
                                id="price"
                                required
                                type="number"
                                step="0.01"
                                className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300/50 font-mono text-lg text-slate-700 transition-all hover:bg-white/80"
                                placeholder="0.00"
                                value={formData.price || ''}
                                onChange={e => handleChange('price', parseFloat(e.target.value))}
                                title="Price"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="quantity" className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Hash size={14} /> 数量 (Qty)
                            </label>
                            <input
                                id="quantity"
                                required
                                type="number"
                                min="1"
                                className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300/50 font-mono text-lg text-slate-700 transition-all hover:bg-white/80"
                                value={formData.quantity || 1}
                                onChange={e => handleChange('quantity', parseInt(e.target.value))}
                                title="Quantity"
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <label htmlFor="notes" className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            笔记 (Notes)
                        </label>
                        <textarea
                            id="notes"
                            rows={3}
                            className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300/50 text-slate-700 placeholder-slate-400 resize-none transition-all hover:bg-white/80"
                            placeholder="IV Rank, 市场情绪..."
                            value={formData.notes || ''}
                            onChange={e => handleChange('notes', e.target.value)}
                            title="Notes"
                        ></textarea>
                    </div>

                    <button type="submit" className="w-full bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-95 mt-4 flex items-center justify-center gap-2">
                        <Save size={20} />
                        <span>确认提交</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default JournalView;