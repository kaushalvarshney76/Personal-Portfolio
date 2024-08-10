import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URI, {
          dbName: process.env.DB_NAME
        });
        console.log("Database connected successfully!!")
        console.log(`Database host at port ${connection.host}`);
    } catch (error) {
        console.log(`Failed to connect database!!:\n ERROR: ${error}`)
    }
}
