
const STORAGE_KEYS = {
    TRADES: 'sakura-option-trades',
};

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = value.toString();
        },
        removeItem: (key) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
        // Helper to inspect store
        _getStore: () => store
    };
})();

global.localStorage = localStorageMock;

// Mock console
const consoleMock = {
    warn: console.warn,
    error: console.error,
    log: console.log
};

// Logic from storageUtils.ts
const loadTrades = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.TRADES);
        if (stored === null) return null;

        const parsed = JSON.parse(stored);

        // 数据验证
        if (!Array.isArray(parsed)) {
            consoleMock.warn('Invalid trades data in localStorage, returning null');
            return null;
        }

        return parsed;
    } catch (error) {
        consoleMock.error('Error loading trades from localStorage:', error);
        return null;
    }
};

const saveTrades = (trades) => {
    try {
        const serialized = JSON.stringify(trades);
        localStorage.setItem(STORAGE_KEYS.TRADES, serialized);
        return true;
    } catch (error) {
        consoleMock.error('Error saving trades to localStorage:', error);
        return false;
    }
};

// Test Scenario
console.log('--- Starting Test ---');

// 1. Initial State (No data)
console.log('1. Initial Load (No Data):', loadTrades()); // Should be null

// 2. Save Empty Array
console.log('2. Saving Empty Array...');
saveTrades([]);
console.log('   Store content:', localStorage._getStore());

// 3. Load after saving empty array
const loaded = loadTrades();
console.log('3. Load after saving empty array:', loaded);
console.log('   Is Array?', Array.isArray(loaded));
console.log('   Length:', loaded ? loaded.length : 'N/A');

if (loaded !== null && Array.isArray(loaded) && loaded.length === 0) {
    console.log('SUCCESS: Empty array persisted and loaded correctly.');
} else {
    console.log('FAILURE: Empty array did not load correctly.');
}

// 4. Dashboard Logic Simulation
const initializeTrades = () => {
    const savedTrades = loadTrades();
    if (savedTrades !== null) {
        return savedTrades;
    }
    return ['DEFAULT_DATA'];
};

console.log('4. Dashboard Initialization result:', initializeTrades());

if (initializeTrades().length === 0) {
    console.log('SUCCESS: Dashboard uses empty array.');
} else {
    console.log('FAILURE: Dashboard reverted to default data.');
}
