import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

class Database {
  private static instance: Database;
  private client: MongoClient;
  private db?: Db;
  private isConnected: boolean = false;

  private constructor() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI must be defined');
    }
    this.client = new MongoClient(uri);
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect();
      this.db = this.client.db('pichanga_db');
      this.isConnected = true;
      console.log('Connected to MongoDB');
    }
  }

  getDb(): Db {
    if (!this.db || !this.isConnected) {
      throw new Error('Database not connected');
    }
    return this.db;
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.close();
      this.isConnected = false;
      console.log('Disconnected from MongoDB');
    }
  }
}

export const db = Database.getInstance();