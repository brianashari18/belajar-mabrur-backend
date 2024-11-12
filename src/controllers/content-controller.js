import contentService from "../services/content-service.js";

const add = async (req, res, next) => {
    try {
        const result = await contentService.add(req.body);
        res.status(200).json({
            code: 200,
            status: 'OK',
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const getAll = async (req, res, next) => {
    try {
        const result = await contentService.getAll(req.body);
        res.status(200).json({
            code: 200,
            status: 'OK',
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const get  = async (req, res, next) => {
    try {
        const result = await contentService.get(req);
        res.status(200).json({
            code: 200,
            status: 'OK',
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const result = await contentService.update(req);
        res.status(200).json({
            code: 200,
            status: 'OK',
            data: result
        })
    } catch (e) {
        next(e);
    }
}

const remove = async (req, res, next) => {
    try {
        const result = await contentService.remove(req);
        res.status(200).json({
            code: 200,
            status: 'OK'
        })
    } catch (e) {
        next(e);
    }
}

export default {
    add,
    getAll,
    get,
    update,
    remove
}