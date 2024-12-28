const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('stop recording'),
    async execute(interaction, bot) {
        bot.leave(interaction);
        await interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor('#3498DB')
                .setTitle('Left')
                .setTimestamp()], components: [], ephemeral: true
        });
    },
};