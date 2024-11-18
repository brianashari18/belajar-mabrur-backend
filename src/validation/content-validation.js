import Joi from "joi";

const addUpdateContentValidation = Joi.object({
    name: Joi.string().max(100).required(),
    arabic: Joi.string().max(1600).required(),
    latin: Joi.string().max(1600).required(),
    translate_id: Joi.string().max(1600).required(),
    category: Joi.string().max(50).required(), // Add validation for category
    description: Joi.string().max(255).required() // Add validation for description
});

export {
    addUpdateContentValidation
}
