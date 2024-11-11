import Joi from "joi";

const addContentValidation = Joi.object({
    name: Joi.string().max(100).required(),
    arabic: Joi.string().max(100).required(),
    latin: Joi.string().max(100).required(),
    translate_id: Joi.string().max(100).required(),
});

export {
    addContentValidation,
}