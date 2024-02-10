import mongoose from "mongoose";
import Group from "../Schema/Group";

const URI = process.env.MONGO_DB_URI


const connectToMongoDB = async () => {
    try {
        await mongoose.connect(`${URI}`);
        console.log('Connected to MongoDB');
        // await Group.collection.dropIndex('inviteKeys.key_1');
    } catch (error: any) {
        console.error(error.message);
        process.exit(1);
    }
};

export default connectToMongoDB;