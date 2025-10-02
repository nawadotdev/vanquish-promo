import { useCode } from "../../services/code.service.js "
import { createData, isDataExists } from "../../services/data.service.js"

export default {
    customId: "usecode",
    execute : async interaction => {

        const inputs = interaction.fields

        const code = inputs.getField("code").value.trim()
        const email = inputs.getField("email").value.trim()
        const phone = inputs.getField("phone").value.trim()

        if(!code){
            return await interaction.reply({ content: "Code is required.", ephemeral: true });
        }

        if(!email && !phone){
            return await interaction.reply({ content: "Please provide at least an email or a phone number.", ephemeral: true });
        }

        const existingData = await isDataExists(interaction.user.id)
        if(existingData){
            return await interaction.reply({ content: "You have already used a code before. You cannot use another code.", ephemeral: true });
        }

        await interaction.reply({ content: `Processing your code: \`${code}\`...\n\nEmail: \`${email || "None"}\`\nPhone: \`${phone || "None"}\``, ephemeral: true });

        try{
            const result = await useCode(code, interaction.user.id)
            if(result){
                await createData(interaction.user.id, email || null, phone || null);
                return await interaction.editReply({ content: `Code \`${code}\` used successfully! Your data has been saved.\n\nEmail: \`${email || "None"}\`\nPhone: \`${phone || "None"}\``, ephemeral: true });
            }else{
                return await interaction.editReply({ content: "Failed to use the code for an unknown reason.", ephemeral: true });
            }
        } catch(err){
            return await interaction.editReply({ content: `Error using code: ${err.message}`, ephemeral: true });
        }

    }
}