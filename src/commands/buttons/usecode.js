import { TextInputBuilder } from "@discordjs/builders"
import { ActionRowBuilder, ModalBuilder, TextInputStyle } from "discord.js"

export default {
    customId: "usecode",
    execute: async interaction => {

        const modal = new ModalBuilder()
            .setCustomId('usecode')
            .setTitle('Use a Code')
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('code')
                        .setLabel("Code")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                        .setPlaceholder("Enter the code here")
                ),
                new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId('email')
                        .setLabel("Email")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                        .setPlaceholder("Enter your email here")
                ),
                new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setCustomId('phone')
                        .setLabel("Phone Number")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                        .setPlaceholder("Enter your phone number here. (e.g +905555555555)")
                )
                
            )

        try{
            await interaction.showModal(modal);
        }catch(err){
            await interaction.reply({ content: `Error showing modal: ${err.message}`, ephemeral: true });
        }

    }
}