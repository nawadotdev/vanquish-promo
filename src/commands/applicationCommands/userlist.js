import { AttachmentBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { getAllData } from "../../services/data.service.js";
import ExcelJS from "exceljs";

export default {
    command: new SlashCommandBuilder()
        .setName("userlist")
        .setDescription("Get a list of all users")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute: async interaction => {

        const data = await getAllData()

        if (!data || data.length === 0) {
            return await interaction.reply({ content: `No users found.`, ephemeral: true });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Users");

        worksheet.columns = [
            { header: "Discord ID", key: "discordId", width: 25 },
            { header: "Email", key: "email", width: 30 },
            { header: "Phone", key: "phone", width: 20 },
            { header: "Created At", key: "createdAt", width: 25 },
            { header: "Updated At", key: "updatedAt", width: 25 },
        ];

        data.forEach(user => {
            worksheet.addRow({
                discordId: user.discordId,
                email: user.email || "",
                phone: user.phone || "",
                createdAt: user.createdAt?.toISOString() ?? "",
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const attachment = new AttachmentBuilder(buffer, { name: "users.xlsx" });

        await interaction.reply({ content: `Here is the user list:`, files: [attachment], ephemeral: true });

    }
}