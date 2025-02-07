import { Collection, ObjectId } from 'mongodb';
import { db } from '../config/database';
import { User } from '../types/auth.types';

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
    return this.collection.findOne({ email });
  }

  async findById(_id: ObjectId): Promise<User | null> {
    return this.collection.findOne({ _id });
  }

  async create(user: Omit<User, '_id'>): Promise<User> {
    const result = await this.collection.insertOne(user as User);
    return { ...user, _id: result.insertedId };
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