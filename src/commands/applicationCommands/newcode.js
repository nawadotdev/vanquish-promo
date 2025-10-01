import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { createCode } from "../../services/code.service.js";

export default {
    command: new SlashCommandBuilder()
    .setName("newcode")
    .setDescription("Create a new code")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option => 
        option.setName("code")
        .setDescription("The code to create")
        .setRequired(true)
    )
    .addIntegerOption(option => 
        option.setName("maxuses")
        .setDescription("The maximum number of uses for this code")
        .setRequired(true)
    )
    .addIntegerOption(option => 
        option.setName("startdate")
        .setDescription("The start date for this code (timestamp in ms)")
        .setRequired(false)
    )
    .addIntegerOption(option => 
        option.setName("enddate")
        .setDescription("The end date for this code (timestamp in ms)")
        .setRequired(false)
    ),
    execute: async (interaction) => {

        const code = interaction.options.getString("code");
        const maxUses = interaction.options.getInteger("maxuses");
        const startDate = interaction.options.getInteger("startdate") || null;
        const endDate = interaction.options.getInteger("enddate") || null;
        const creator = interaction.user.id;

        await interaction.reply({ content: "Creating code...", ephemeral: true });

        let newCode;
        try{
            newCode = await createCode(code, startDate, endDate, maxUses, creator);
        }catch(err){
            return interaction.editReply({ content: `Error creating code: ${err.message}`, ephemeral: true });
        }

        await interaction.editReply({ content: `Code created successfully! Sending to the channel...\n\nCode: \`${newCode.code}\`\nMax Uses: \`${newCode.maxUses}\`\nStart Date: \`${newCode.startDate ? new Date(newCode.startDate).toLocaleString() : "None"}\`\nEnd Date: \`${newCode.endDate ? new Date(newCode.endDate).toLocaleString() : "None"}\``, ephemeral: true });

        try{
            await interaction.channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("New Code Created")
                    .addFields(
                        { name: "Code", value: `\`${newCode.code}\``, inline: true },
                        { name: "Max Uses", value: `\`${newCode.maxUses}\``, inline: true },
                        { name: "Start Date", value: `\`${newCode.startDate ? new Date(newCode.startDate).toLocaleString() : "None"}\``, inline: true },
                        { name: "End Date", value: `\`${newCode.endDate ? new Date(newCode.endDate).toLocaleString() : "None"}\``, inline: true },
                        { name: "Creator", value: `<@${newCode.creator}>`, inline: true }
                    )
                ],
                rows: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId("usecode")
                        .setLabel("Use Code")
                        .setStyle(ButtonStyle.Primary)
                    )
                ]
            })
        } catch(err){
            return interaction.editReply({ content: `Error sending code to channel: ${err.message}`, ephemeral: true });
        }

    }
}