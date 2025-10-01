import { Events } from "discord.js"
import { readdirSync } from "fs";

const applicationCommands = new Map()

const commandFiles = readdirSync("./src/commands/applicationCommands").filter(file => file.endsWith(".js"));
console.log(`Found ${commandFiles.length} command files. (Interaction create)`);
for (const file of commandFiles) {
    try {
        const command = await import(`../commands/applicationCommands/${file}`);
        if (command && command.default && command.default.command && command.default.execute) {
            applicationCommands.set(command.default.command.name, command.default);
            console.log(`Loaded command: ${command.default.command.name}`);
        } else {
            console.warn(`Invalid command file: ${file}`);
        }
    } catch (err) {
        console.error(`Error loading command file ${file}:`, err);
    }
}

export default async client => {

    client.on(Events.InteractionCreate, async interaction => {

        let command

        if (interaction.isChatInputCommand?.()) {
            console.log(interaction.commandName)
            command = applicationCommands.get(interaction.commandName);
        }

        if (!command) {
            try {
                await interaction.reply({ content: "Unknown command.", ephemeral: true });
            } catch (err) {
                console.error("Error replying to unknown command interaction:", err);
            }
            return;
        }

        try {
            await command.execute(interaction);
        } catch (err) {
            console.error(`Error executing command ${interaction.commandName}:`, err);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }

    })

}