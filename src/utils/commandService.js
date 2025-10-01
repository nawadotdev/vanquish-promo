import { REST, Routes } from "discord.js";
import "dotenv/config"
import { readdirSync } from "fs";

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

export const registerGuildCommands = async client => {

    console.log("Starting command registration...");

    if (!BOT_TOKEN) {
        throw new Error("BOT_TOKEN is not defined");
    }

    const rest = new REST().setToken(BOT_TOKEN);

    const applicationCommands = []

    const commandFiles = readdirSync("./src/commands/applicationCommands").filter(file => file.endsWith(".js"));
    console.log(`Found ${commandFiles.length} command files.`);
    for (const file of commandFiles) {
        try {
            const command = await import(`../commands/applicationCommands/${file}`);
            applicationCommands.push(command.default.command.toJSON());
        } catch (err) {
            console.error(`Error loading command file ${file}:`, err);
        }
    }

    console.log(`Registering ${applicationCommands.length} application commands.`);

    console.log("Fetching guilds...");
    const guilds = await client.guilds.fetch();
    console.log(`Found ${guilds.size} guilds.`);

    for (let guild of guilds) {
        guild = guild[1];
        console.log(`Registering commands for guild ${guild.id} (${guild.name})`);
        await rest.put(
            Routes.applicationGuildCommands(client.user.id, guild.id),
            { body: applicationCommands }
        )
    }

    console.log("Command registration complete.");

}