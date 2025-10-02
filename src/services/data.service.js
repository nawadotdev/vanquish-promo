import { Data } from "../models/data.model.js"

export const getDataByDiscordId = async (discordId) => {
    return await Data.findOne({ discordId });
}

export const createData = async (discordId, email = null, phone = null) => {
    if (!discordId) throw new Error("Discord ID is required");
    if(!email && !phone) throw new Error("At least one of email or phone is required");

    const newData = await Data.create({ discordId, email, phone });
    return newData;
}

export const isDataExists = async (discordId) => {
    if (!discordId) throw new Error("Discord ID is required");
    return await Data.exists({ discordId });
}