const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const currency = require('../currency');

const balancesPath = path.join(__dirname, '../balances.json');
let balances = require(balancesPath);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('give')
    .setDescription('他のユーザーにお金を渡します')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('送金先ユーザー')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('送る金額')
        .setRequired(true)
    ),

  async execute(interaction) {
    const sender = interaction.user;
    const receiver = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    if (receiver.id === sender.id) {
      return interaction.reply({ content: '自分には送れません。', ephemeral: true });
    }

    if (amount <= 0) {
      return interaction.reply({ content: '1以上の金額を指定してください。', ephemeral: true });
    }

    // 初期化されていないユーザーの残高を初期化
    if (!balances[sender.id]) balances[sender.id] = currency.initialBalance;
    if (!balances[receiver.id]) balances[receiver.id] = currency.initialBalance;

    if (balances[sender.id] < amount) {
      return interaction.reply({ content: '残高が足りません。', ephemeral: true });
    }

    balances[sender.id] -= amount;
    balances[receiver.id] += amount;

    fs.writeFileSync(balancesPath, JSON.stringify(balances, null, 2));

    await interaction.reply(`${sender.username} が ${receiver.username} に ${amount}${currency.symbol} 渡しました！`);
  }
};