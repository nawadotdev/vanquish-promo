import { Code } from "../models/code.model.js";

export const createCode = async (code, startDate = null, endDate = null, maxUses = 1, creator) => {
    if (!code) throw new Error("Code is required");
    if (!creator) throw new Error("Creator is required");

    const newCode = await Code.create({ code, startDate, endDate, maxUses, creator });
    return newCode;
}

export const getCode = async (code) => {
    if (!code) throw new Error("Code is required");

    const foundCode = await Code.findOne({ code });
    return foundCode;
}

export const deleteCode = async (code) => {
    if (!code) throw new Error("Code is required");

    const deletedCode = await Code.findOneAndDelete({ code });
    return deletedCode;
}

export const useCode = async (code, userId) => {
    if (!code) throw new Error("Code is required");
    if (!userId) throw new Error("User ID is required");

    const now = Date.now();

    const _code = await getCode(code);

    if (!_code) throw new Error("Code not found");

    if (_code.uses.includes(userId)) throw new Error("You have already used this code");

    if(_code.startDate && now < _code.startDate) throw new Error("This code is not active yet");
    if(_code.endDate && now > _code.endDate) throw new Error("This code has expired");

    if (_code.uses.length >= _code.maxUses) throw new Error("This code has reached its maximum number of uses");

    const result = await Code.findOneAndUpdate(
        {
            code,
            $expr: {
                $lt: [
                    { $size: "$uses" },
                    "$maxUses"
                ]
            },
            uses: { $ne: userId },
            $and: [
                {
                    $or: [
                        { startDate: null },
                        { startDate: { $lte: now } }
                    ]
                },
                {
                    $or: [
                        { endDate: null },
                        { endDate: { $gte: now } }
                    ]
                }
            ]
        },
        {
            $push: { uses: userId }
        },
        { new: true }
    )

    return result;
}