import Database from 'better-sqlite3';
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
        this.db = new Database(DB_PATH);
        this.db.pragma('foreign_keys = ON');
        console.log('Connected to SQLite database at', DB_PATH);
    }

    async init() {
        try {
            this.db.exec(SCHEMA_SQL);
            console.log('Database schema verified & ready.');
            return Promise.resolve();
        } catch (err) {
            console.error('Error executing schema SQL:', err);
            return Promise.reject(err);
        }
    }

    async query(sql, params = []) {
        try {
            const stmt = this.db.prepare(sql);
            const rows = stmt.all(params);
            return Promise.resolve(rows);
        } catch (err) {
            console.error('Query Error:', sql, err);
            return Promise.reject(err);
        }
    }

    async get(sql, params = []) {
        try {
            const stmt = this.db.prepare(sql);
            const row = stmt.get(params);
            return Promise.resolve(row);
        } catch (err) {
            console.error('Get Error:', sql, err);
            return Promise.reject(err);
        }
    }

    async run(sql, params = []) {
        try {
            // Support multi-statement scripts if passed without params
            if (params.length === 0 && sql.trim().includes(';') && sql.trim().split(';').filter(s => s.trim()).length > 1) {
                this.db.exec(sql);
                return Promise.resolve({ id: null, changes: 0 });
            }
            const stmt = this.db.prepare(sql);
            const info = stmt.run(params);
            return Promise.resolve({ id: info.lastInsertRowid, changes: info.changes });
        } catch (err) {
            console.error('Run Error:', sql, err);
            return Promise.reject(err);
        }
    }

    async close() {
        try {
            this.db.close();
            return Promise.resolve();
        } catch (err) {
            return Promise.reject(err);
        }
    }
}

export const db = new SQLiteDatabase();
