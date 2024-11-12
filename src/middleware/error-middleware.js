import {ResponseError} from "../error/response-error.js";
import {NotFoundError} from "../error/notfound-error.js";

const errorMiddleware = async (err, req, res, next) => {
    if (!err) {
        next();
        return;
    }

    if (err instanceof NotFoundError) {
        res.status(404).json({
            code: err.status,
            status: 'NOT FOUND',
            errors: err.message
        }).end();
    } else if (err instanceof ResponseError) {
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
