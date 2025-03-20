import { Collection, ObjectId } from 'mongodb';
import { db } from '../config/database';
import { User } from '../types/auth.types';
import { logger } from '../utils/logger';

class UserModel {
  private static instance: UserModel;
  private collection!: Collection<User>;

  private constructor() {}

  public static async getInstance(): Promise<UserModel> {
    if (!UserModel.instance) {
      const instance = new UserModel();
      await db.connect();
      instance.collection = db.getDb().collection<User>('users');
      UserModel.instance = instance;
    }
    return UserModel.instance;
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const collection = db.getDb().collection('users');
      const user = await collection.findOne({ email }) as User | null;
      return user;
    } catch (error) {
      logger.error('Error al buscar usuario por email:', error);
      throw error;
    }
  }
  
  async findById(_id: ObjectId): Promise<User | null> {
    return this.collection.findOne({ _id });
  }

  async create(userData: Omit<User, '_id'>): Promise<User> {
    try {
      const collection = db.getDb().collection('users');
      const result = await collection.insertOne(userData);
      return { _id: result.insertedId, ...userData };
    } catch (error) {
      logger.error('Error al crear usuario:', error);
      throw error;
    }
  }

  async updateById(_id: ObjectId, update: Partial<User>): Promise<boolean> {
    const result = await this.collection.updateOne(
      { _id },
      { $set: { ...update, updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }
}

// Export a promise that resolves to the UserModel instance
export const userModel = UserModel.getInstance();