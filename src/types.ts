import React from 'react';

/**
 * 期权交易记录
 * 表示一笔完整的期权交易，包括开仓和平仓信息
 */
export interface OptionTrade {
  /** 唯一标识符 */
  id: string;

  /** 标的代码 (如: AAPL, SPY) */
  ticker: string;

  /** 策略名称 (如: Iron Condor, Call, Put) */
  strategy: string;

  /** 到期日期 (YYYY-MM-DD格式) */
  expDate: string;

  /** 持仓方向 - LONG表示做多，SHORT表示做空 */
  side: 'LONG' | 'SHORT';

  /** 数量 */
  quantity: number;

  /** 开仓价格 */
  entryPrice: number;

  /** 开仓日期 (YYYY-MM-DD格式) */
  entryDate: string;

  /** 交易状态 - OPEN表示持仓中，CLOSED表示已平仓 */
  status: 'OPEN' | 'CLOSED';

  /** 平仓价格（仅当status为CLOSED时存在） */
  closePrice?: number;

  /** 平仓日期（仅当status为CLOSED时存在） */
  closeDate?: string;

  /** 已实现盈亏 (Profit and Loss) */
  pnl: number;

  /** 备注信息 */
  notes?: string;
}

/**
 * 交易日志输入数据
 * 用于创建新交易或平仓时的输入表单
 */
export interface TradeLogInput {
  /** 标的代码 */
  ticker: string;

  /** 策略名称 */
  strategy: string;

  /** 到期日期 */
  expDate: string;

  /** 交易动作 - BUY表示买入，SELL表示卖出 */
  action: 'BUY' | 'SELL';

  /** 交易价格 */
  price: number;

  /** 数量 */
  quantity: number;

  /** 交易日期 */
  date: string;

  /** 备注信息 */
  notes?: string;
}

/**
 * 应用视图枚举
 * 定义应用中的所有视图类型
 */
export enum AppView {
  /** 仪表板视图 - 显示持仓概览和快捷操作 */
  DASHBOARD = 'DASHBOARD',

  /** 历史记录视图 - 显示所有交易历史 */
  HISTORY = 'HISTORY',

  /** 图表视图 - 显示利润曲线和统计数据 */
  CHARTS = 'CHARTS',

  /** 交易表单视图 - 记录新交易或平仓 */
  TRADE_FORM = 'TRADE_FORM',
}

/**
 * 导航项配置
 * 用于底部导航栏的配置
 */
export interface NavItem {
  /** 视图ID */
  id: AppView;

  /** 显示标签 */
  label: string;

  /** 图标组件 */
  icon: React.ReactNode;
}

// ==================== 类型守卫函数 ====================

/**
 * 检查交易是否已平仓
 * @param trade - 交易记录
 * @returns 如果已平仓返回true
 */
export const isClosedTrade = (trade: OptionTrade): boolean => {
  return trade.status === 'CLOSED' && !!trade.closeDate && trade.closePrice !== undefined;
};

/**
 * 检查交易是否持仓中
 * @param trade - 交易记录
 * @returns 如果持仓中返回true
 */
export const isOpenTrade = (trade: OptionTrade): boolean => {
  return trade.status === 'OPEN';
};

/**
 * 验证交易输入数据的有效性
 * @param input - 交易输入数据
 * @returns 如果数据有效返回true，否则返回错误信息
 */
export const validateTradeInput = (
  input: Partial<TradeLogInput>
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!input.ticker || input.ticker.trim() === '') {
    errors.push('标的代码不能为空');
  }

  if (!input.strategy || input.strategy.trim() === '') {
    errors.push('策略名称不能为空');
  }

  if (!input.expDate) {
    errors.push('到期日期不能为空');
  }

  if (!input.action) {
    errors.push('交易动作不能为空');
  }

  if (input.price === undefined || input.price < 0) {
    errors.push('价格必须大于等于0');
  }

  if (input.quantity === undefined || input.quantity <= 0) {
    errors.push('数量必须大于0');
  }

  if (!input.date) {
    errors.push('交易日期不能为空');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};