"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Database {
    constructor() {
        this.isConnected = false;
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI must be defined');
        }
        this.client = new mongodb_1.MongoClient(uri);
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    async connect() {
        if (!this.isConnected) {
            await this.client.connect();
            this.db = this.client.db('pichanga_db');
            this.isConnected = true;
            console.log('Connected to MongoDB');
        }
    }
    getDb() {
        if (!this.db || !this.isConnected) {
            throw new Error('Database not connected');
        }
        return this.db;
    }
    async disconnect() {
        if (this.isConnected) {
            await this.client.close();
            this.isConnected = false;
            console.log('Disconnected from MongoDB');
        }
    }
}
exports.db = Database.getInstance();
