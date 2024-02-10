"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const URI = process.env.MONGO_DB_URI;
const connectToMongoDB = async () => {
    try {
        await mongoose_1.default.connect(`${URI}`);
        console.log('Connected to MongoDB');
        // await Group.collection.dropIndex('inviteKeys.key_1');
    }
    catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};
exports.default = connectToMongoDB;
