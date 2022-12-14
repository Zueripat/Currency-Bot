const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js');
const dbFunctions = require('../handlers/db/functions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addcoins')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription('Add coins to a user!')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to add coins to')
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName('amount')
        .setDescription('The amount of coins to add')
        .setRequired(true)
    ),
  async execute(interaction) {
    const functions = new dbFunctions();
    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');
    const embed = new EmbedBuilder();

    let dbUser = await functions.getUser({ _id: user.id });
    if (dbUser) {
      await functions.updateUser({
        _id: user.id,
        balance: dbUser?.balance ? dbUser.balance + amount : amount,
        name: user.username,
      });
      embed
        .setTitle('Add Coins')
        .setDescription(
          `${user} now has ${
            dbUser?.balance ? dbUser.balance + amount : amount
          } coins!`
        )
        .setColor('Green')
        .setTimestamp();
    } else {
      dbUser = await functions.createUser({
        _id: user.id,
        name: user.username,
      });
      embed.setTitle('Add Coins').setDescription(`${user} now has no coins!`);
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
