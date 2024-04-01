import { Client, GatewayIntentBits } from "discord.js";
import "dotenv/config";
const TOKEN = process.env.TOKEN || null;

const client = new Client({
  intents: GatewayIntentBits.Guilds | GatewayIntentBits.GuildMessages,
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.content === "!ping") {
    message.channel.send("Pong.");
  }
});

client.login(TOKEN);
