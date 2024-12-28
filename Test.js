const {toMp3, convert} = require("./utils/PcmToText");

const path = "records/713628281118916698-1735374494412.pcm";
toMp3(path).then(r => {
    console.log(r.toString());
})

convert("records/713628281118916698-1735374494412.mp3").then(r => {
    console.log(r.toString());
})