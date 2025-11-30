/**
 * 日期处理工具函数
 */

/**
 * 计算距离指定日期的剩余天数
 * @param dateString - 日期字符串 (YYYY-MM-DD格式)
 * @returns 剩余天数，如果已过期则返回负数
 */
export const getDaysToExpiration = (dateString: string): number => {
    const targetDate = new Date(dateString);
    const today = new Date();

    // 重置时间部分，只比较日期
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
};

/**
 * 获取当前日期的字符串格式
 * @returns YYYY-MM-DD 格式的日期字符串
 */
export const getCurrentDateString = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};

/**
 * 格式化日期为可读格式
 * @param dateString - 日期字符串
 * @param locale - 语言区域，默认为中文
 * @returns 格式化后的日期字符串
 */
export const formatDate = (
    dateString: string,
    locale: string = 'zh-CN'
): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

/**
 * 比较两个日期
 * @param date1 - 第一个日期字符串
 * @param date2 - 第二个日期字符串
 * @returns 如果date1早于date2返回负数，相等返回0，晚于返回正数
 */
export const compareDates = (date1: string, date2: string): number => {
    return new Date(date1).getTime() - new Date(date2).getTime();
};

/**
 * 检查日期是否即将到期
 * @param dateString - 日期字符串
 * @param warningDays - 警告阈值（天数），默认7天
 * @returns 是否即将到期
 */
export const isExpiringSoon = (
    dateString: string,
    warningDays: number = 7
): boolean => {
    const daysLeft = getDaysToExpiration(dateString);
    return daysLeft >= 0 && daysLeft <= warningDays;
};
