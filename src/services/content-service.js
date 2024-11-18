import { validate } from "../validation/validation.js";
import { addUpdateContentValidation } from '../validation/content-validation.js';
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { NotFoundError } from "../error/notfound-error.js";
import { logger } from "../application/logging.js";

// Add Content Function
const add = async (request) => {
    const content = await validate(addUpdateContentValidation, request);

    // const contentCount = await prismaClient.content.count({
    //     where: {
    //         name: content.name,
    //     }
    // });
    //
    // if (contentCount === 1) {
    //     throw new ResponseError(400, "Name already in use");
    // }

    return prismaClient.content.create({
        data: {
            name: content.name,
            arabic: content.arabic,
            latin: content.latin,
            translate_id: content.translate_id,
            category: content.category, // Include category
            description: content.description // Include description
        },
        select: {
            id: true,
            name: true,
            arabic: true,
            latin: true,
            translate_id: true,
            category: true, // Select category
            description: true // Select description
        }
    });
};

// Get All Content Function
const getAll = async (request) => {
    return prismaClient.content.findMany({
        select: {
            id: true,
            name: true,
            arabic: true,
            latin: true,
            translate_id: true,
            category: true, // Include category
            description: true // Include description
        }
    });
};

// Get Content by ID Function
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
            translate_id: true,
            category: true, // Include category
            description: true // Include description
        }
    });

    if (!content) {
        throw new NotFoundError(404, "Content not found");
    }

    return content;
};

// Update Content Function
const update = async (request) => {
    const reqBody = validate(addUpdateContentValidation, request.body);
    const reqParams = request.params;
    const id = parseInt(reqParams.contentId, 10);
    const content = await prismaClient.content.findUnique({
        where: {
            id: id
        }
    });

    if (!content) {
        throw new NotFoundError(404, "Content not found");
    }

    logger.info(reqBody);

    content.name = reqBody.name;
    content.arabic = reqBody.arabic;
    content.latin = reqBody.latin;
    content.translate_id = reqBody.translate_id;
    content.category = reqBody.category; // Update category
    content.description = reqBody.description; // Update description

    return prismaClient.content.update({
        where: {
            id: id
        },
        data: content
    });
};

// Remove Content Function
const remove = async (request) => {
    const reqParams = request.params;
    const id = parseInt(reqParams.contentId, 10);
    const content = await prismaClient.content.findUnique({
        where: {
            id: id
        }
    });

    if (!content) {
        throw new NotFoundError(404, "Content not found");
    }

    return prismaClient.content.delete({
        where: {
            id: id
        },
    });
};

const addMany = async (request) => {
    const contents = request.body; // Assuming `request.body` contains an array of content objects
    const results = [];

    for (const content of contents) {
        const validatedContent = await validate(addUpdateContentValidation, content);

        // const contentCount = await prismaClient.content.count({
        //     where: {
        //         name: validatedContent.name,
        //     }
        // });
        //
        // if (contentCount === 1) {
        //     throw new ResponseError(400, `Name ${validatedContent.name} already in use`);
        // }

        const newContent = await prismaClient.content.create({
            data: {
                name: validatedContent.name,
                arabic: validatedContent.arabic,
                latin: validatedContent.latin,
                translate_id: validatedContent.translate_id,
                category: validatedContent.category,
                description: validatedContent.description
            },
            select: {
                id: true,
                name: true,
                arabic: true,
                latin: true,
                translate_id: true,
                category: true,
                description: true
            }
        });

        results.push(newContent);
    }

    return results;
};

export default {
    add,
    addMany, // Export the addAll function
    getAll,
    get,
    update,
    remove
};