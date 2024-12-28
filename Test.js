const {convert} = require("./utils/PcmToText");

const path = "records/test1.pcm";
convert(path).then(r =>{
    console.log(r);
});