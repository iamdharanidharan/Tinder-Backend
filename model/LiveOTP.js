/* 
*  Live OTP Schema
*  Schema to store unverified OTP
*/
const mongoose = require('mongoose');

const liveOTPSchema = new mongoose.Schema({
    phone : {
        type : String,
        min : 10,
        max : 10,
        required : true
    },
    sentOTP : {
        type : String,
        min : 4,
        max : 4,
        required : true
    },
    expires : {
        type: Date,
        default : Date.now() + (1000 * 60 * 60)
    }
});

module.exports = mongoose.model('LiveOTP',liveOTPSchema);