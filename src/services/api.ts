import { OptionTrade } from '../types';

const API_BASE_URL = '/api';

export const api = {
    async fetchTrades(): Promise<OptionTrade[]> {
        const response = await fetch(`${API_BASE_URL}/trades`);
        if (!response.ok) {
            throw new Error('Failed to fetch trades');
        }
        return response.json();
    },

    async saveTrade(trade: OptionTrade): Promise<OptionTrade> {
        const response = await fetch(`${API_BASE_URL}/trades`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(trade),
        });
        if (!response.ok) {
            throw new Error('Failed to save trade');
        }
        const result = await response.json();
        return result.trade;
    },

    async deleteTrade(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/trades/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete trade');
        }
    }
};
