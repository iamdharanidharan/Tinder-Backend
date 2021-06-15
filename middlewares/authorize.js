/* 
*  Middleware function for Authorization
*/
const token = require('../helpers/token');

module.exports = (req,res,next) => {
    const userToken = req.headers.authtoken;
    if(!userToken) res.status(401).send('Access Denied');

    let verifiedToken = token.verify(userToken);
    if(verifiedToken){
        req.phone = verifiedToken.phone;
        next();
    } else{
        res.status(400).send("Invalid Token");
    }
};