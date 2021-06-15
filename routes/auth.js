/* 
*  Authentication handlers
*  
*/
const router = require('express').Router();  
const validation = require('../helpers/validation');
const token = require('../helpers/token');

const User = require('../model/User');
const LiveOTP = require('../model/LiveOTP');

//Send OTP to user to authenticate phone number for signing up
router.post('/sendSignUpOTP', async (req,res) => {
    //Input Validation
    const { error } = validation.phone(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    try{
        let phoneExists = await User.findOne({phone : req.body.phone});
        if(phoneExists){
            const liveOTP = new LiveOTP({
                phone : req.body.phone,
                sentOTP : "0000"
            });
            //DB write
            await User.findOneAndReplace({phone : req.body.phone});
            res.status(200).send("OTP sent");
        };

        const liveOTP = new LiveOTP({
            phone : req.body.phone,
            sentOTP : "0000"
        });
        //DB write
        await liveOTP.save();
        res.status(200).send("OTP sent");
    }catch(err){
        res.status(500).send("Could not send OTP");
    }
    
});

//Validate the signin OTP to authenticate phone number for signing up
router.post('/validateSignUpOTP', async (req,res) => {
    const { error } = validation.OTP(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    try{
        //DB read
        let liveOTP = await LiveOTP.findOne({ phone : req.body.phone })
        if(!liveOTP) res.status(400).send("OTP has not been sent");

        if(liveOTP.sentOTP == req.body.OTP){
            //JWT token for authorizing create user action
            let createUserToken = token.create({phone: req.body.phone, mode: 'create user'},'24h');
            await LiveOTP.deleteOne({_id : liveOTP._id});
            return res.status(200).send(
                {
                    createusertoken : createUserToken,
                    token_type : "JWT",
                    expires_in : "24h"
                });
        } else{
            res.status(400).send("Invalid OTP");
        }
    }catch(err){
        res.status(500).send("Could not validate OTP");
    }
    
});

//Create user in database if createusertoken is valid
router.post('/createUser', async (req,res) => {
    const { error } = validation.user(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    if(typeof(req.headers.createusertoken) == undefined) return res.status(400).send("Create User token needed");
    
    let parsedToken = token.verify(req.headers.createusertoken);
    if(parsedToken && parsedToken.mode == 'create user'){
        const user = new User({
            phone : parsedToken.phone,
            name : req.body.name
        });
        try{
            let saveUser = await user.save();
            res.status(200).send({
                userId : saveUser._id,
                message : "User create successfully"
            });
        }catch(err){
            res.status(500).send("Could not create user");
        }        
    } else{
        res.status(400).send("Invalid token");
    }
});

//Send OTP to authenticate phone number for signing in
router.post('/sendSignInOTP', async (req,res) => {
        //Input Validation
        const { error } = validation.phone(req.body);
        if(error) return res.status(400).send(error.details[0].message);
    
        try{
            let phoneExists = await User.findOne({phone : req.body.phone});
            if(!phoneExists) return res.status(400).send("User doesnot exists");

            const liveOTP = new LiveOTP({
                phone : req.body.phone,
                sentOTP : "0000"
            });
            await liveOTP.save();
            res.status(200).send("OTP sent");
        }catch(err){
            res.status(500).send("Could not send OTP");
        }
});

//Validate OTP and provide authtoken for future access
router.post('/validateSignInOTP', async (req,res) => {
    const { error } = validation.OTP(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    try{
        let liveOTP = await LiveOTP.findOne({ phone : req.body.phone });
        if(!liveOTP) res.status(400).send("OTP has not been sent");
        
        if(liveOTP.sentOTP == req.body.OTP){
            //auth token, to be used for authorization after signing in
            let authToken = token.create({phone: req.body.phone, mode: 'loggedIn'},'24h');
            await LiveOTP.deleteOne({_id : liveOTP._id});
            return res.status(200).send(
                {
                    authtoken : authToken,
                    token_type : "JWT",
                    expires_in : "24h"
                });
        } else{
            res.status(400).send("Invalid OTP");
        }
    }catch(err){
        res.status(500).send("Could not validate OTP");
    }
});

module.exports = router;