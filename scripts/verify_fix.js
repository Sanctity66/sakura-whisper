
const STORAGE_KEYS = {
    TRADES: 'sakura-option-trades',
    HAS_LAUNCHED: 'sakura-has-launched',
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
        if (!Array.isArray(parsed)) return null;
        return parsed;
    } catch (error) {
        return null;
    }
};

// Dashboard Initialization Logic
const initializeTrades = () => {
    const savedTrades = loadTrades();
    if (savedTrades !== null) {
        return savedTrades;
    }

    const hasLaunched = localStorage.getItem(STORAGE_KEYS.HAS_LAUNCHED);
    if (hasLaunched) {
        return [];
    }

    return ['DEFAULT_DATA'];
};

// Simulation
console.log('--- Starting Verification ---');

// Scenario 1: First Run
console.log('1. First Run:');
console.log('   Store:', localStorage._getStore());
const trades1 = initializeTrades();
console.log('   Initialized Trades:', trades1);

if (trades1[0] === 'DEFAULT_DATA') {
    console.log('SUCCESS: Default data loaded on first run.');
    // Simulate useEffect setting flag
    localStorage.setItem(STORAGE_KEYS.HAS_LAUNCHED, 'true');
} else {
    console.log('FAILURE: Default data NOT loaded on first run.');
}

// Scenario 2: User deletes all data (Key exists, empty array)
console.log('\n2. User deletes all data (Empty Array Saved):');
localStorage.setItem(STORAGE_KEYS.TRADES, '[]');
console.log('   Store:', localStorage._getStore());
const trades2 = initializeTrades();
console.log('   Initialized Trades:', trades2);

if (Array.isArray(trades2) && trades2.length === 0) {
    console.log('SUCCESS: Empty array loaded when saved.');
} else {
    console.log('FAILURE: Empty array NOT loaded.');
}

// Scenario 3: Data lost/Key removed, but HAS_LAUNCHED is true (The Bug Fix)
console.log('\n3. Data lost/Key removed (HAS_LAUNCHED=true):');
localStorage.removeItem(STORAGE_KEYS.TRADES);
console.log('   Store:', localStorage._getStore());
const trades3 = initializeTrades();
console.log('   Initialized Trades:', trades3);

if (Array.isArray(trades3) && trades3.length === 0) {
    console.log('SUCCESS: Empty array loaded (instead of defaults) when data missing but launched before.');
} else {
    console.log('FAILURE: Defaults restored incorrectly.');
}
