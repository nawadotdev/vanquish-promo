import "dotenv/config"
import { Client } from "discord.js";

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

const client = new Client({
    intents: []
})

export const startClient = async () => {
    if (!BOT_TOKEN) {
        throw new Error("BOT_TOKEN is not defined");
    }

    await client.login(BOT_TOKEN);
}