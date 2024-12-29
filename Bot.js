const fs = require('node:fs');
const { joinVoiceChannel } = require('@discordjs/voice');
const prism = require('prism-media');
const {convert} = require("./utils/PcmToText");
const {sleep} = require("groq-sdk/core");

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
            if (userId !== "713628281118916698") return;
            //console.log(userId+" started")
            const path = `records/${userId}-${Date.now()}.pcm`;
            this.writeStream[id] = fs.createWriteStream(path);
            this.listenStream[id] = this.connection[id].receiver.subscribe(userId);
            const opusDecoder = new prism.opus.Decoder({
                frameSize: 960,
                channels: 2,
                rate: 48000,
            });
            this.listenStream[id].pipe(opusDecoder).pipe(this.writeStream[id]);
            console.log(this.listenStream[id].length)
            this.writeStream[id].on('finish', () => {
                convert(path).then(r =>{
                    console.log(r);
                    interaction.channel.send(r);
                });
            });
        });

        this.connection[id].receiver.speaking.on('end', () => {
            //actions here
            //console.log(userId+" ended")
            sleep(7000);
            if (this.writeStream[id]) {
                this.writeStream[id].end();
                this.writeStream[id] = null;
                this.listenStream[id] = null;
            }
        });
    }

    async leave(interaction) {
        this.connection[interaction.guildId].destroy();
    }
}
module.exports = {
    Bot
};