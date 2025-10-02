import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { getDataByDiscordId } from "../../services/data.service.js";

export default {
    command: new SlashCommandBuilder()
    .setName("getuser")
    .setDescription("Get information about a user")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(option => option
        .setName("user")
        .setDescription("Select the target user")
        .setRequired(true)
    ),
    execute : async interaction => {

        const user = interaction.options.getUser("user")

        const data = await getDataByDiscordId(user.id);

        if(!data || data.length === 0){
            return await interaction.reply({ content: `No data found for user <@${user.id}>.`, ephemeral: true });
        }

        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Data for ${user.tag}`)
                .addFields(
                    {
                        name: "Email",
                        value: data.email || "N/A",
                    },
                    {
                        name: "Phone",
                        value: data.phone || "N/A",
                    },
                    {
                        name: "Time",
                        value: `<t:${Math.floor(data.createdAt.getTime() / 1000)}:F>` || "N/A",
                    },
                )
            ],
            ephemeral: true
        })

    }
}