"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const database_1 = require("../config/database");
const logger_1 = require("../utils/logger");
class UserModel {
    constructor() { }
    static async getInstance() {
        if (!UserModel.instance) {
            const instance = new UserModel();
            await database_1.db.connect();
            instance.collection = database_1.db.getDb().collection('users');
            UserModel.instance = instance;
        }
        return UserModel.instance;
    }
    async findByEmail(email) {
        try {
            const collection = database_1.db.getDb().collection('users');
            const user = await collection.findOne({ email });
            return user;
        }
        catch (error) {
            logger_1.logger.error('Error al buscar usuario por email:', error);
            throw error;
        }
    }
    async findById(_id) {
        return this.collection.findOne({ _id });
    }
    async create(userData) {
        try {
            const collection = database_1.db.getDb().collection('users');
            const result = await collection.insertOne(userData);
            return { _id: result.insertedId, ...userData };
        }
        catch (error) {
            logger_1.logger.error('Error al crear usuario:', error);
            throw error;
        }
    }
    async updateById(_id, update) {
        const result = await this.collection.updateOne({ _id }, { $set: { ...update, updatedAt: new Date() } });
        return result.modifiedCount > 0;
    }
}
// Export a promise that resolves to the UserModel instance
exports.userModel = UserModel.getInstance();
