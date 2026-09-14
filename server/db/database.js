import initSqlJs from 'sql.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { SCHEMA_SQL } from './schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'jobmatch.db');

export class SQLiteDatabase {
    constructor() {
        this.SQL = null;
        this.db = null;
        this.initialized = false;
    }

    async init() {
        if (this.initialized && this.db) {
            return Promise.resolve();
        }

        try {
            this.SQL = await initSqlJs();
            
            if (fs.existsSync(DB_PATH) && fs.statSync(DB_PATH).size > 0) {
                const fileBuffer = fs.readFileSync(DB_PATH);
                this.db = new this.SQL.Database(fileBuffer);
                console.log('Connected to existing SQLite database at', DB_PATH);
            } else {
                this.db = new this.SQL.Database();
                console.log('Created fresh in-memory SQLite database, syncing to', DB_PATH);
            }

            this.db.run('PRAGMA foreign_keys = ON');
            this.db.run(SCHEMA_SQL);
            this.persist();
            this.initialized = true;
            console.log('Database schema verified & ready.');
            return Promise.resolve();
        } catch (err) {
            console.error('Database initialization error:', err);
            return Promise.reject(err);
        }
    }

    persist() {
        try {
            if (this.db) {
                const data = this.db.export();
                const buffer = Buffer.from(data);
                fs.writeFileSync(DB_PATH, buffer);
            }
        } catch (err) {
            console.error('Error persisting database to disk:', err);
        }
    }

    async query(sql, params = []) {
        await this.ensureReady();
        try {
            const stmt = this.db.prepare(sql);
            if (params && params.length > 0) {
                stmt.bind(params);
            }
            const rows = [];
            while (stmt.step()) {
                rows.push(stmt.getAsObject());
            }
            stmt.free();
            return Promise.resolve(rows);
        } catch (err) {
            console.error('Query Error:', sql, err);
            return Promise.reject(err);
        }
    }

    async get(sql, params = []) {
        await this.ensureReady();
        try {
            const stmt = this.db.prepare(sql);
            if (params && params.length > 0) {
                stmt.bind(params);
            }
            let row = null;
            if (stmt.step()) {
                row = stmt.getAsObject();
            }
            stmt.free();
            return Promise.resolve(row);
        } catch (err) {
            console.error('Get Error:', sql, err);
            return Promise.reject(err);
        }
    }

    async run(sql, params = []) {
        await this.ensureReady();
        try {
            if (!params || params.length === 0) {
                this.db.run(sql);
            } else {
                this.db.run(sql, params);
            }
            this.persist();

            let lastID = null;
            let changes = 0;
            try {
                const res = this.db.exec("SELECT last_insert_rowid() as id, changes() as changes");
                if (res && res.length > 0 && res[0].values && res[0].values.length > 0) {
                    lastID = res[0].values[0][0];
                    changes = res[0].values[0][1];
                }
            } catch (e) {
                // Ignore metadata fetch errors for complex scripts
            }

            return Promise.resolve({ id: lastID, changes });
        } catch (err) {
            console.error('Run Error:', sql, err);
            return Promise.reject(err);
        }
    }

    async ensureReady() {
        if (!this.initialized || !this.db) {
            await this.init();
        }
    }

    async close() {
        try {
            if (this.db) {
                this.persist();
                this.db.close();
            }
            return Promise.resolve();
        } catch (err) {
            return Promise.reject(err);
        }
    }
}

export const db = new SQLiteDatabase();
