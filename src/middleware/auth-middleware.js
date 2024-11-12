import { prismaClient } from "../application/database.js";

export const authMiddleware = async (req, res, next) => {
    const token = req.get('Authorization');

    // Validate Authorization token
    if (!token) {
        res.status(401).json({
            code: 401,
            status: "UNAUTHORIZED",
            errors: "Unauthorized user"
        }).end();
    } else {
        const user = await prismaClient.user.findFirst({
            where: {
                token: token
            }
        });

        if (!user) {
            res.status(401).json({
                code: 401,
                status: "UNAUTHORIZED",
                errors: "Unauthorized user"
            }).end();
        } else {
            req.user = user;
            next();
        }
    }
};
