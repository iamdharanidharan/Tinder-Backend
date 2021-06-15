const router = require('express').Router();  
const verifyUser = require('../middlewares/authorize');
const validation = require('../helpers/validation');
const User = require('../model/User');
const Images = require('../model/Images');

//Send Images to client upon authorization
router.get("/images", verifyUser, async (req, res)=>{
    try{
        let images = await Images.find();
        res.status(200).send(images);
    }catch(err){
        res.status(500).send("Could not get images");
    }
});

//Add new preferences to preference list without changing existing preferences list
router.patch("/addPreference", verifyUser, async (req, res)=>{

    const { error } = validation.preference(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    try{
        //$push adds content to existing array
        await User.findOneAndUpdate({phone : req.phone}, {
            $push: {
                preferences : {
                    imageID : req.body.imageID,
                    isAccepted : req.body.isAccepted,
                    timestamp : Date.now()
                }
            }
        });
        res.status(200).send("Preference Added Successfully");
    }catch(err){
        res.status(500).send("Could not Add Preference");
    }
   
});

//Return all preferences action by user
router.get("/history", verifyUser, async (req, res)=>{
    try{
       let history = await User.findOne({phone: req.phone})
                                .populate({
                                            path: 'preferences',
                                            populate : {
                                                path: 'imageID',
                                                model: 'Images'
                                            }
                                        })
                                .exec();

        res.status(200).send(history.preferences.map((x)=>{
            return {
                isAccepted : x.isAccepted,
                timestamp : x.timestamp,
                imageID : x.imageID._id,
                name : x.imageID.name,
                url : x.imageID.url
            }
        }));
    }catch(err){
        res.status(500).send("Could not get history");
    }
});

module.exports = router;