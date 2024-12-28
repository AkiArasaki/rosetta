const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('start recording'),
    async execute(interaction, bot) {
        bot.join(interaction);
        await interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor('#3498DB')
                .setTitle('Joined')
                .setTimestamp()], components: [], ephemeral: true
        });
    },
};