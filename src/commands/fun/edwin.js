import { SlashCommandBuilder, userMention } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("edwin")
    .setDescription("Pings Edwin!")
    .addStringOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of times to ping Edwin")
    ),
  async execute(interaction) {
    const channel = interaction.channel;
    const amount = interaction.options.getString("amount") || 1;
    interaction.reply({
      content: `Pinging Edwin ${amount} times!`,
      ephemeral: true,
    });
    for (let i = 0; i < amount; i++) {
      await channel.send({
        content: `Hey ${userMention("872843006267502672")}!`,
        ephemeral: true,
      });
    }
  },
};
