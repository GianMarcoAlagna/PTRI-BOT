import { REST, Routes } from "discord.js";
import "dotenv/config";

const TOKEN = process.env.TOKEN || null;
const rest = new REST({ version: "10" }).setToken(TOKEN);
(async () => {
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(Routes.applicationCommands("YOUR_CLIENT_ID"), {
      body: [
        {
          name: "ping",
          description: "Replies with Pong!",
        },
      ],
    });
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
