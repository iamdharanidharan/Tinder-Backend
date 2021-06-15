/* 
*  Helper functions to sign and verify tokens
*/

const jwt = require('jsonwebtoken');

//Container
let token = {};

token.create = (data,expiry) => {
    return jwt.sign(data, process.env.JWT_KEY, { expiresIn : expiry});
}

token.verify = (token) => {
    return jwt.verify(token, process.env.JWT_KEY, (err, parsedToken)=>{
       if(!err){
           return parsedToken;
       } else return false;
   });
}

module.exports = token;