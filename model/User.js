/* 
*  User Schema
*/
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        min : 6,
        max : 255
    },
    phone : {
        type : String,
        min : 10,
        max : 10,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now() 
    },
    preferences : [
        {
            imageID : {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Images',
                required : true
            },
            isAccepted : {
                type : Boolean,
                default : false
            },
            timestamp : {
                type : Date,
                default: Date.now()
            }
        }
    ]
});

module.exports = mongoose.model('User',userSchema);