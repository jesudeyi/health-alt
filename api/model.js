// Create business model and export
import { model, Schema } from "mongoose";

const businessSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    menu: [
        {
            ingredients: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
        },
    ],
    regNumber: {
        type: Number,
        required: true,
    },
    reports: [
        {
            type: String,
            required: true,
        },
    ],
});

const Business = model("Business", businessSchema);

export { Business };
