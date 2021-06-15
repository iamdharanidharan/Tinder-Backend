/* 
*  Images Schema
*/
const mongoose = require('mongoose');

const imagesSchema = new mongoose.Schema({
    name : {
        type : String,
        min : 3,
        max : 255,
        required : true
    },
    url : {
        type : String,
        min : 10,
        max : 255,
        required : true
    }
});

module.exports = mongoose.model('Images',imagesSchema);