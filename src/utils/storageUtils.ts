/**
 * localStorage 数据持久化工具
 */

import { OptionTrade } from '../types';
import { STORAGE_KEYS } from '../constants';

/**
 * 从 localStorage 读取交易记录
 * @returns 交易记录数组，如果不存在则返回空数组
 */
export const loadTrades = (): OptionTrade[] | null => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.TRADES);
        if (stored === null) return null;

        const parsed = JSON.parse(stored);

        // 数据验证
        if (!Array.isArray(parsed)) {
            console.warn('Invalid trades data in localStorage, returning null');
            return null;
        }

        return parsed;
    } catch (error) {
        console.error('Error loading trades from localStorage:', error);
        return null;
    }
};

/**
 * 保存交易记录到 localStorage
 * @param trades - 交易记录数组
 * @returns 是否保存成功
 */
export const saveTrades = (trades: OptionTrade[]): boolean => {
    try {
        const serialized = JSON.stringify(trades);
        localStorage.setItem(STORAGE_KEYS.TRADES, serialized);
        return true;
    } catch (error) {
        console.error('Error saving trades to localStorage:', error);
        return false;
    }
};

/**
 * 清除所有交易记录
 * @returns 是否清除成功
 */
export const clearTrades = (): boolean => {
    try {
        localStorage.removeItem(STORAGE_KEYS.TRADES);
        return true;
    } catch (error) {
        console.error('Error clearing trades from localStorage:', error);
        return false;
    }
};

/**
 * 导出交易记录为JSON文件
 * @param trades - 交易记录数组
 * @param filename - 文件名，默认为带时间戳的文件名
 */
export const exportTradesToJson = (
    trades: OptionTrade[],
    filename?: string
): void => {
    const defaultFilename = `sakura-trades-${new Date().toISOString().split('T')[0]}.json`;
    const blob = new Blob([JSON.stringify(trades, null, 2)], {
        type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || defaultFilename;
    link.click();

    URL.revokeObjectURL(url);
};

/**
 * 从JSON文件导入交易记录
 * @param file - JSON文件
 * @returns Promise<交易记录数组>
 */
export const importTradesFromJson = (file: File): Promise<OptionTrade[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const trades = JSON.parse(content);

                if (!Array.isArray(trades)) {
                    reject(new Error('Invalid file format: expected an array'));
                    return;
                }

                resolve(trades);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
};
