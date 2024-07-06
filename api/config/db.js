import { connect } from "mongoose";
import colors from "colors";
import { AppConfig } from "./index";

const connectDB = async () => {
    try {
        const conn = await connect(AppConfig.MONGODB_URI);

        console.log(
            colors.cyan.underline(`MongoDB Connected: ${conn.connection.host}`)
        );
    } catch (error) {
        console.log(
            colors.red.underline(`Mongo DB Connection Error: ${error.message}`)
        );
        process.exit(1);
    }
};

export default connectDB;
