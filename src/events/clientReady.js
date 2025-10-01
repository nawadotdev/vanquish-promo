import { Events } from "discord.js"
import { registerGuildCommands } from "../utils/commandService.js"; 

export default client => {

    client.once(Events.ClientReady, async (cl) => {
        console.log(`Logged in as ${client.user.tag}`);

        // await registerGuildCommands(client);
    })

}