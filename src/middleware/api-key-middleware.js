export const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.get('X-API-KEY');

    // Validate API key
    if (!apiKey || apiKey !== process.env.API_KEY) {
        res.status(403).json({
            code: 403,
            status: "Forbidden",
            errors: "Invalid or missing API key"
        }).end();
    } else {
        next();
    }
}