const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const currency = require('../currency');

const balancesPath = path.join(__dirname, '../balances.json');
let balances = require(balancesPath);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addmoney')
    .setDescription('指定ユーザーにお金を追加します（管理者専用）')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('対象ユーザー')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('追加する金額')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    if (!balances[target.id]) {
      balances[target.id] = currency.initialBalance;
    }

    balances[target.id] += amount;

    fs.writeFileSync(balancesPath, JSON.stringify(balances, null, 2));

    await interaction.reply(`${target.username} に ${amount} ${currency.name} を追加しました。\n現在の所持金: ${balances[target.id]} ${currency.name}`);
  }
};