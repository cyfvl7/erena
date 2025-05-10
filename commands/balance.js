const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const currency = require('../currency');

const balancesPath = path.join(__dirname, '../balances.json');
let balances = require(balancesPath);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('指定ユーザー、または自分の所持金を確認します')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('確認したいユーザー（省略可能）')
        .setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser('user') || interaction.user;

    if (!balances[target.id]) {
      balances[target.id] = currency.initialBalance;
      fs.writeFileSync(balancesPath, JSON.stringify(balances, null, 2));
    }

    await interaction.reply({
      content: `${target.username} の所持金は ${balances[target.id]}${currency.symbol} です。`,
      ephemeral: false
    });
  }
};