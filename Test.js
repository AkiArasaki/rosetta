const {convert} = require("./utils/PcmToText");

const path = "records/713628281118916698-1735378456333.pcm";
convert(path).then(r =>{
    console.log(r);
});