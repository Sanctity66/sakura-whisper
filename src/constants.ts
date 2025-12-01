/**
 * 应用常量定义
 * 统一管理应用中使用的所有常量值
 */

// ==================== LocalStorage 键名 ====================

/** localStorage中存储交易记录的键名 */
export const STORAGE_KEYS = {
  TRADES: 'sakura-option-trades',
  HAS_LAUNCHED: 'sakura-has-launched',
} as const;

// ==================== 设计系统 - 颜色配置 ====================

/** 设计系统颜色配置 */
export const COLORS = {
  // 主题色
  primary: {
    pink: '#ec4899',
    slate: '#1e293b',
  },
  // 语义化颜色
  semantic: {
    success: '#10b981',
    danger: '#f43f5e',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
  // 交易方向颜色
  trade: {
    long: '#10b981',
    short: '#f43f5e',
  },
} as const;

// ==================== 动画参数 ====================

/** 动画延迟配置（毫秒） */
export const ANIMATION_DELAYS = {
  none: 0,
  short: 200,
  medium: 400,
  long: 600,
} as const;

/** 动画持续时间配置（毫秒） */
export const ANIMATION_DURATIONS = {
  fast: 300,
  normal: 500,
  slow: 800,
  verySlow: 1500,
} as const;

// ==================== 业务常量 ====================

/** 到期警告阈值（天数） */
export const EXPIRATION_WARNING_DAYS = 7;

/** 图表配置 */
export const CHART_CONFIG = {
  width: 800,
  height: 400,
  padding: 40,
  visualBuffer: 0.15, // 图表上下留白比例
} as const;

/** 樱花花瓣背景配置 */
export const SAKURA_CONFIG = {
  colors: [
    'rgba(255, 255, 255, 0.9)',
    'rgba(255, 240, 245, 0.8)',
    'rgba(255, 228, 225, 0.85)',
  ],
  density: 10000, // 每10000像素一个花瓣
  depthRange: { min: 0.5, max: 1.5 }, // 景深范围
} as const;

// ==================== UI 文案 ====================

/** 应用文案配置 */
export const UI_TEXT = {
  app: {
    title: '樱花期权笔记',
    subtitle: '在波动中寻找内心的宁静',
  },
  nav: {
    dashboard: '概览',
    history: '历史',
    charts: '图表',
  },
  trade: {
    long: 'LONG',
    short: 'SHORT',
    open: 'OPEN',
    closed: 'CLOSED',
    buy: 'BUY',
    sell: 'SELL',
  },
} as const;
