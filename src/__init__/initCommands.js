import fs from "fs";
import path from "path";
import { REST, Routes } from "discord.js";
import colorize from "../console/index.js";
import "dotenv/config";

const TOKEN = process.env.TOKEN || null;
const CLIENT_ID = process.env.CLIENT_ID || null;
const rest = new REST().setToken(TOKEN);

const __dirname = path.resolve();
const foldersPath = path.join(__dirname, "src", "commands");
const commandFolders = fs.readdirSync(foldersPath);
const commands = [];

async function loadCommands(client) {
  colorize.green("Loading commands");
  if (!client) {
    throw new Error(
      "Command loader requires a client instance, received" +
        typeof client +
        client
    );
  }
  try {
    colorize.green(`Found ${commandFolders.length} command folders`);

    for (const folder of commandFolders) {
      colorize.green(`Loading commands from ${folder} folder`);

      const commandsPath = path.join(foldersPath, folder);
      const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));
      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        colorize.yellow(`Processing command file ${file}`);

        //* We have to convert path to URL because ES modules use URL file paths to import modules
        const modulePath = new URL("file://" + filePath);
        let command = await import(modulePath);
        //* get default export if it exists
        command = command.default || command;

        //* Set a new item in the Collection with the key as the command name and the value as the exported module
        if ("data" in command && "execute" in command) {
          client.commands.set(command.data.name, command);
          commands.push(command.data.toJSON());
          colorize.blue(`Loaded command ${command.data.name}`);
        } else {
          colorize.red(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
          );
        }
      }
    }
  } catch (error) {
    throw new Error("An error occurred while loading commands" + error);
  }
}

async function deploy() {
  try {
    colorize.white(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    //* The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    });

    colorize.white(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    //* And of course, make sure you catch and log any errors!
    throw new Error(error);
  }
}

export default async function __init__(client) {
  try {
    await loadCommands(client);
    await deploy();
    return true;
  } catch (error) {
    colorize.red("An error occurred while initializing commands" + error);
    return false;
  }
}
