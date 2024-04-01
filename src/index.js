import { Client, GatewayIntentBits, Collection, Events } from "discord.js";
import "dotenv/config";
import colorize from "./console/index.js";
import __init__ from "./__init__/initCommands.js";

const TOKEN = process.env.TOKEN || null;
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.commands = new Collection();

client.on(Events.InteractionCreate, async (interaction) => {
  console.log(`Received interaction ${interaction.commandName}`);

  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

//* Construct and prepare an instance of the REST module
client.on("ready", async () => {
  colorize.green(`Logged in as ${client.user.tag}`);
  //* Load and deploy commands
  const success = await __init__(client);
  if (success) {
    colorize.green("Successfully loaded and deployed commands!");
  } else {
    colorize.red("Failed to load, and or, deploy commands.");
    process.exit(1);
  }
});

try {
  await client.login(TOKEN);
  colorize.green("Successfully logged in with the provided token.");
} catch (error) {
  colorize.red("Failed to login with the provided token.");
  process.exit(1);
}
