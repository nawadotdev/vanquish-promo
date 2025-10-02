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

const buttons = new Map()
const buttonFiles = readdirSync("./src/commands/buttons").filter(file => file.endsWith(".js"));
console.log(`Found ${buttonFiles.length} button command files. (Interaction create)`);
for (const file of buttonFiles) {
    try {
        const buttonCommand = await import(`../commands/buttons/${file}`);
        if (buttonCommand && buttonCommand.default && buttonCommand.default.customId && buttonCommand.default.execute) {
            buttons.set(buttonCommand.default.customId, buttonCommand.default);
            console.log(`Loaded button command: ${buttonCommand.default.customId}`);
        } else {
            console.warn(`Invalid button command file: ${file}`);
        }
    } catch (err) {
        console.error(`Error loading button command file ${file}:`, err);
    }
}

const modals = new Map()
const modalFiles = readdirSync("./src/commands/modals").filter(file => file.endsWith(".js"));
console.log(`Found ${modalFiles.length} modal command files. (Interaction create)`);
for (const file of modalFiles) {
    try {
        const modalCommand = await import(`../commands/modals/${file}`);
        if (modalCommand && modalCommand.default && modalCommand.default.customId && modalCommand.default.execute) {
            modals.set(modalCommand.default.customId, modalCommand.default);
            console.log(`Loaded modal command: ${modalCommand.default.customId}`);
        } else {
            console.warn(`Invalid modal command file: ${file}`);
        }
    } catch (err) {
        console.error(`Error loading modal command file ${file}:`, err);
    }
}

export default async client => {

    client.on(Events.InteractionCreate, async interaction => {

        let command

        if (interaction.isChatInputCommand?.()) {
            command = applicationCommands.get(interaction.commandName);
        }

        if (interaction.isButton?.()) {
            command = buttons.get(interaction.customId);
        }

        if(interaction.isModalSubmit?.()) {
            command = modals.get(interaction.customId);
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