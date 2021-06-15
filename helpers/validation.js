/* 
*   Input validation helpers
*/

const Joi = require('@hapi/joi');

let validation = {};

validation.phone =  (data) => {
    //Input rules
    const schema = Joi.object({
        phone : Joi.string()
                   .length(10)
                   .pattern(/^[0-9]+$/)
                   .required()
    });
    return schema.validate(data);
};

validation.OTP = (data) => {
    //Input rules
    const schema = Joi.object({
        phone : Joi.string()
                   .length(10)
                   .pattern(/^[0-9]+$/)
                   .required(),
        OTP : Joi.string()
                 .length(4)
                 .pattern(/^[0-9]+$/)
                 .required()
    });
    return schema.validate(data);
};

validation.user = (data) => {
    //Input rules
    const schema = Joi.object({
        name : Joi.string()
                  .min(3)
                  .max(20)
                  .required()
    });
    return schema.validate(data);
};

validation.preference = (data) => {
    //Input rules
    const schema = Joi.object({
        imageID : Joi.string()
                     .min(24)
                     .max(24)
                     .required(),
        isAccepted : Joi.boolean()
                        .required(),
        timestamp : Joi.date()
                       .optional()
    });
    return schema.validate(data);
}

module.exports = validation;