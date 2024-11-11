import {web} from "./application/web.js";
import {logger} from "./application/logging.js";

const host = process.env.HOST;
const port = process.env.PORT;

web.listen(port, host, () => {
    logger.info(`App started on http://${host}:${port}`);
});