const fs = require("node:fs");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const Groq = require("groq-sdk");
const {groqApiKey} = require('../config.json');

const groqTest = new Groq({ apiKey: groqApiKey });
ffmpeg.setFfmpegPath(ffmpegPath);

async function toMp3(path) {
    ffmpeg(path)
        .inputFormat('s32le')
        .audioCodec('libmp3lame')
        .audioBitrate('320k')
        .audioChannels(2)
        .audioFrequency(48000)
        .save(path.split('.')[0] + '.mp3');
    return path.split('.')[0] + '.mp3';
}

async function convert(path) {
    const transcription = await groqTest.audio.transcriptions.create({
        file: fs.createReadStream(path),
        model: "whisper-large-v3-turbo",
        prompt: "Specify context or spelling",
        response_format: "json",
        language: "en",
        temperature: 0.0,
    });
    return transcription.text;
}

module.exports = {
    toMp3,
    convert
}