import {ResponseError} from "../error/response-error.js";

const errorMiddleware = async (err, req, res, next) => {
    if (!err) {
        next();
        return;
    }

    if (err instanceof ResponseError) {
        res.status(err.status).json({
            code: err.status,
            status: 'BAD REQUEST',
            errors: err.message
        }).end();
    }  else {
        res.status(500).json({
            code: err.status,
            status: 'INTERNAL SERVER ERROR',
            errors: err.message
        }).end();
    }
}

export {
    errorMiddleware
}
