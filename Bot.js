const fs = require('node:fs');
const { joinVoiceChannel } = require('@discordjs/voice');
const prism = require('prism-media');

class Bot {
    constructor() {
        this.connection = [];
        this.writeStream = [];
        this.listenStream = []
    }

    async join(interaction) {
        const id = interaction.guildId;
        this.connection[id] = joinVoiceChannel({
            channelId: interaction.member.voice.channelId,
            guildId: id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfDeaf: false
        });
        this.connection[id].receiver.speaking.on('start', (userId) => {
            console.log(userId+" started")
            this.writeStream[id] = fs.createWriteStream(`records/${userId}-${Date.now()}.pcm`);
            this.listenStream[id] = this.connection[id].receiver.subscribe(userId);

            const opusDecoder = new prism.opus.Decoder({
                frameSize: 960,
                channels: 2,
                rate: 48000,
            });
            this.listenStream[id].pipe(opusDecoder).pipe(this.writeStream[id]);
        });

        this.connection[id].receiver.speaking.on('end', (userId) => {
            //actions here
            console.log(userId+" ended")
            this.writeStream[id].destroy();
            this.listenStream[id].destroy();
        });
    }

    async leave(interaction) {
        this.connection[interaction.guildId].destroy();
    }
}
module.exports = {
    Bot
};