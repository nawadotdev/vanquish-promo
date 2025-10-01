import { Events } from "discord.js"

export default client => {

    client.once(Events.ClientReady, (cl) => {
        console.log(`Logged in as ${client.user.tag}`);
    })

}