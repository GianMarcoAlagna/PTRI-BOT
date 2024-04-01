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
  try {
    if (interaction.isChatInputCommand()) {
      colorize.blue(`Received interaction ${interaction.commandName}`);
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
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
    } else if (interaction.isButton()) {
      try {
        // colorize.green(`Button interaction: ${interaction.customId}`);
        const { guild, member } = interaction;

        if (!guild) {
          colorize.red("Guild not found");
          return;
        }

        const roles = guild.roles;

        if (!roles) {
          colorize.red("Roles not found in the guild");
          return;
        }

        // colorize.green(`Roles found in the guild: ${roles.cache.size}`);
        //* check if the user has the role
        const role = roles.cache.get(interaction.customId);

        if (member.roles.cache.has(role.id)) {
          await member.roles.remove(role);
          await interaction.reply({
            content: `Removed role ${role.name}`,
            ephemeral: true,
          });
        } else {
          await member.roles.add(role);
          await interaction.reply({
            content: `Added role ${role.name}`,
            ephemeral: true,
          });
        }
      } catch (error) {
        console.error(error);
        interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  } catch (error) {
    console.error(error);
    interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.on("ready", async () => {
  colorize.green(`Logged in as ${client.user.tag}`);
  //* Load and deploy commands
  const success = await __init__(client);
  if (success) {
    colorize.green("Successfully loaded and deployed commands!");
    client.user.setActivity("Changing The World 🌎", { type: "CUSTOM" });
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
