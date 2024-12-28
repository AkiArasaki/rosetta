const fs = require("node:fs");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const Groq = require("groq-sdk");
const {groqApiKey} = require('../config.json');

const groqTest = new Groq({ apiKey: groqApiKey });
ffmpeg.setFfmpegPath(ffmpegPath);

async function convert(path) {
    return new Promise((resolve) => {
        toMp3(path).then(stream => {
            toText(stream).then(data => {
                resolve(data)
            });
        });
    });
}

async function toMp3(path) {
    return new Promise((resolve, reject) => {
        const outputPath = path.split('.')[0] + '.mp3';
        ffmpeg(path)
            .inputFormat('s32le')
            .audioCodec('libmp3lame')
            .audioBitrate('320k')
            .audioChannels(2)
            .audioFrequency(48000)
            .save(outputPath)
            .on('end', () => {
                resolve(fs.createReadStream(outputPath));
            })
            .on('error', (err) => {
                reject(err);
            });
    });
}

async function toText(stream) {
    const transcription = await groqTest.audio.transcriptions.create({
        file: stream,
        model: "whisper-large-v3-turbo",
        prompt: "Specify context or spelling",
        response_format: "json",
        language: "en",
        temperature: 0.0,
    });
    return transcription.text;
}

module.exports = {
    convert
}