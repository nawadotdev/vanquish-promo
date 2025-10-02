import { Schema, model } from "mongoose";

const dataSchema = new Schema({
    discordId: { type: String, required: true, unique: true },
    email: { type: String, required: false },
    phone: { type: String, required: false }
}, { timestamps: true });

export const Data = model("Data", dataSchema);