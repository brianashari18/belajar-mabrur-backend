import {web} from "./application/web.js";
import {logger} from "./application/logging.js";

const host = '192.168.18.11';
const port = 3000;

web.listen(port, host, () => {
    logger.info(`App started on http://${host}:${port}`);
});