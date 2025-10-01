import "dotenv/config"
import { Client, GatewayIntentBits } from "discord.js";
import { readdirSync } from "fs";

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

const client = new Client({
    intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions]
})

export const startClient = async () => {
    if (!BOT_TOKEN) {
        throw new Error("BOT_TOKEN is not defined");
    }

    await client.login(BOT_TOKEN);
}

const events = readdirSync("./src/events").filter(file => file.endsWith(".js"));

for (const event of events) {
    const eventFile = await import(`../events/${event}`);
    eventFile.default(client);
}