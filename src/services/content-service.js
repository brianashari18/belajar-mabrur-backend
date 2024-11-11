import {request} from "express";
import {validate} from "../validation/validation.js";
import {
    addContentValidation
} from '../validation/content-validation.js';
import {prismaClient} from "../application/database.js";
import {ResponseError} from "../error/response-error.js";

const add = async (request) => {
    const content = await validate(addContentValidation, request);

    const contentCount = await prismaClient.content.count({
        where: {
            name: content.username,
        }
    })

    if (contentCount === 1) {
        throw ResponseError(400, "Name already in use");
    }

    return prismaClient.content.create({
        data: content,
        select: {
            name: true,
            arabic: true,
            latin: true,
            translate_id: true
        }
    })
}

export default {
    add
}