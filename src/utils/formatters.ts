/**
 * 数字格式化工具函数
 */

/**
 * 格式化货币
 * @param value - 数值
 * @param currency - 货币代码，默认USD
 * @param showSign - 是否显示正负号，默认false
 * @returns 格式化后的货币字符串
 */
export const formatCurrency = (
    value: number,
    currency: string = 'USD',
    showSign: boolean = false
): string => {
    const formatted = value.toLocaleString('en-US', {
        style: 'currency',
        currency,
    });

    if (showSign && value > 0) {
        return `+${formatted}`;
    }

    return formatted;
};

/**
 * 格式化百分比
 * @param value - 数值（0-100）
 * @param decimals - 小数位数，默认1位
 * @returns 格式化后的百分比字符串
 */
export const formatPercentage = (
    value: number,
    decimals: number = 1
): string => {
    return `${value.toFixed(decimals)}%`;
};

/**
 * 格式化数字（千分位分隔）
 * @param value - 数值
 * @param decimals - 小数位数，默认2位
 * @returns 格式化后的数字字符串
 */
export const formatNumber = (
    value: number,
    decimals: number = 2
): string => {
    return value.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
};

/**
 * 格式化为紧凑数字（如1.2K, 1.5M）
 * @param value - 数值
 * @returns 格式化后的紧凑数字字符串
 */
export const formatCompactNumber = (value: number): string => {
    const formatter = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
    });

    return formatter.format(value);
};

/**
 * 四舍五入到指定小数位
 * @param value - 数值
 * @param decimals - 小数位数
 * @returns 四舍五入后的数值
 */
export const roundTo = (value: number, decimals: number = 2): number => {
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
};
