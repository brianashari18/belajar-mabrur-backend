import {validate} from "../validation/validation.js";
import {addContentValidation, updateContentValidation} from '../validation/content-validation.js';
import {prismaClient} from "../application/database.js";
import { ResponseError} from "../error/response-error.js";
import {logger} from "../application/logging.js";
import {NotFoundError} from "../error/notfound-error.js";
import {re} from "prisma/build/child.js";

const add = async (request) => {
    const content = await validate(addContentValidation, request);

    const contentCount = await prismaClient.content.count({
        where: {
            name: content.name,
        }
    })

    if (contentCount === 1) {
        throw new ResponseError(400, "Name already in use");
    }

    return prismaClient.content.create({
        data: content,
        select: {
            id: true,
            name: true,
            arabic: true,
            latin: true,
            translate_id: true
        }
    })
}

const getAll = async (request) => {
    const content = request;
    return prismaClient.content.findMany({
        select: {
            id: true,
            name: true,
            arabic: true,
            latin: true,
            translate_id: true
        }
    });
};

const get = async (request) => {
    const id = parseInt(request.params.contentId, 10);
    const content = await prismaClient.content.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            name: true,
            arabic: true,
            latin: true,
            translate_id: true
        }
    })

    if (!content) {
        throw new NotFoundError(404, "Content not found");
    }

    return content;
}

const update = async (request) => {
    const reqBody = validate(updateContentValidation, request.body);
    const reqParams = request.params;
    const id = parseInt(reqParams.contentId, 10);
    const content = await prismaClient.content.findUnique({
        where: {
            id: id
        }
    })

    if (!content) {
        throw new NotFoundError(404, "Content not found");
    }

    content.name = reqBody.data.name;
    content.arabic = reqBody.data.arabic;
    content.latin = reqBody.data.latin;
    content.translate_id = reqBody.data.translate_id;

    return prismaClient.content.update({
        where: {
            id: id
        },
        data: content
    });
}

export default {
    add,
    getAll,
    get,
    update
}