import {validate} from "../validation/validation.js";
import {addContentValidation, updateContentValidation} from '../validation/content-validation.js';
import {prismaClient} from "../application/database.js";
import { ResponseError} from "../error/response-error.js";
import {NotFoundError} from "../error/notfound-error.js";
import {logger} from "../application/logging.js";

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

    logger.info(reqBody);

    content.name = reqBody.name;
    content.arabic = reqBody.arabic;
    content.latin = reqBody.latin;
    content.translate_id = reqBody.translate_id;

    return prismaClient.content.update({
        where: {
            id: id
        },
        data: content
    });
}

const remove = async (request) => {
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

    return prismaClient.content.delete({
        where: {
            id: id
        },
    });
}

export default {
    add,
    getAll,
    get,
    update,
    remove
}