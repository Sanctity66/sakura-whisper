require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Initialize DB schema
async function initDb() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS trades (
                id TEXT PRIMARY KEY,
                ticker TEXT NOT NULL,
                strategy TEXT NOT NULL,
                exp_date TEXT NOT NULL,
                side TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                entry_price NUMERIC NOT NULL,
                entry_date TEXT NOT NULL,
                status TEXT NOT NULL,
                close_price NUMERIC,
                close_date TEXT,
                pnl NUMERIC NOT NULL,
                notes TEXT
            );
        `);
        console.log('Database initialized');
    } catch (err) {
        console.error('Database initialization failed:', err);
    }
}

initDb();

// Routes

// GET /api/trades - Fetch all trades
app.get('/api/trades', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM trades ORDER BY entry_date DESC');
        // Convert snake_case to camelCase for frontend
        const trades = result.rows.map(row => ({
            id: row.id,
            ticker: row.ticker,
            strategy: row.strategy,
            expDate: row.exp_date,
            side: row.side,
            quantity: row.quantity,
            entryPrice: parseFloat(row.entry_price),
            entryDate: row.entry_date,
            status: row.status,
            closePrice: row.close_price ? parseFloat(row.close_price) : undefined,
            closeDate: row.close_date || undefined,
            pnl: parseFloat(row.pnl),
            notes: row.notes || undefined
        }));
        res.json(trades);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/trades - Create or Update trade
app.post('/api/trades', async (req, res) => {
    const trade = req.body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const queryText = `
      INSERT INTO trades (
        id, ticker, strategy, exp_date, side, quantity, 
        entry_price, entry_date, status, close_price, close_date, pnl, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (id) DO UPDATE SET
        ticker = EXCLUDED.ticker,
        strategy = EXCLUDED.strategy,
        exp_date = EXCLUDED.exp_date,
        side = EXCLUDED.side,
        quantity = EXCLUDED.quantity,
        entry_price = EXCLUDED.entry_price,
        entry_date = EXCLUDED.entry_date,
        status = EXCLUDED.status,
        close_price = EXCLUDED.close_price,
        close_date = EXCLUDED.close_date,
        pnl = EXCLUDED.pnl,
        notes = EXCLUDED.notes;
    `;

        const values = [
            trade.id,
            trade.ticker,
            trade.strategy,
            trade.expDate,
            trade.side,
            trade.quantity,
            trade.entryPrice,
            trade.entryDate,
            trade.status,
            trade.closePrice || null,
            trade.closeDate || null,
            trade.pnl,
            trade.notes || null
        ];

        await client.query(queryText, values);
        await client.query('COMMIT');

        res.json({ success: true, trade });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});

// DELETE /api/trades/:id - Delete trade
app.delete('/api/trades/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM trades WHERE id = $1', [id]);
        res.json({ success: true, id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
