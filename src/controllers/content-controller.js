import userService from "../services/user-service.js";
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

export default {
    add
}