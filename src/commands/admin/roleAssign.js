import {
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  ActionRowBuilder,
} from "discord.js";
import colorize from "../../console/index.js";

export default {
  data: new SlashCommandBuilder()
    .setName("create-role-assign")
    .setDescription("Create a role assign button"),
  async execute(interaction) {
    const channel = interaction.channel;
    
    //* grab and sort all roles that start with PTRI
    const roles = interaction.guild.roles.cache
      .filter((role) => role.name.startsWith("PTRI"))
      .map((role) => {
        const number = parseInt(role.name.match(/\d+/)[0]);
        return {
          role_name: role.name,
          role_id: role.id,
          number: number,
        };
      })
      .sort((a, b) => a.number - b.number);
    //* create a button for each role
    const buttons = roles.map((role) => {
      return new ButtonBuilder()
        .setLabel(role.role_name)
        .setCustomId(role.role_id)
        .setStyle(ButtonStyle.Success)
        .setDisabled(false);
    });

    //* every 5 buttons, create a new row
    const buttonRows = [];
    while (buttons.length) {
      buttonRows.push(buttons.splice(0, 5));
    }
    const actionRows = buttonRows.map((row) => {
      return new ActionRowBuilder().addComponents(row);
    });

    interaction.reply({
      content: "Creating role assign buttons",
      ephemeral: true,
    });

    channel.send({
      content: "Please select a role to assign",
      components: actionRows,
    });
  },
};
