const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hello')
		.setDescription('挨拶します'),

	async execute(client, interaction) {
		await interaction.reply({ content: `こんにちは`, ephemeral: true });
	},
};