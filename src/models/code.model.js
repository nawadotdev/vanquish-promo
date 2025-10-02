import { Schema, model } from "mongoose"

const codeSchema = new Schema({
    code: { type: String, required: true, unique: true },
    startDate: { type: Number, required: false },
    endDate: { type: Number, required: false },
    maxUses: { type: Number, required: true },
    uses: { type: [String], default: [] },
    creator: { type: String, required: true }
}, { timestamps: true })

codeSchema.index({ code: 1 });

export const Code = model("Code", codeSchema);