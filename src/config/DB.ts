import mongoose from "mongoose";

const URI = process.env.MONGO_DB_URI

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(`${URI}`);
        console.log('Connected to MongoDB');
    } catch (error: any) {
        console.error(error.message);
        process.exit(1);
    }
};

export default connectToMongoDB;