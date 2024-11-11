import {removeTestContent} from "./test-util.js";
import supertest from "supertest";
import {web} from "../application/web.js";
import {logger} from "../application/logging.js";

describe('POST /api/contents', function() {
    afterEach(async function() {
        await removeTestContent();
    })

    it('should can add new content', async () => {
        const result = await supertest(web)
            .post('/api/contents')
            .set({'X-API-KEY': process.env.API_KEY, 'Content-Type': 'application/json'})
            .send({
                name: "test",
                arabic: "test",
                latin: "test",
                translate_id: "test"
            });

        logger.info(result.body);

        expect(result.body.code).toBe(200);
        expect(result.body.status).toBe("OK");
        expect(result.body.data.name).toBe("test");
        expect(result.body.data.arabic).toBe("test");
        expect(result.body.data.latin).toBe("test");
        expect(result.body.data.translate_id).toBe("test");
    })

    it('should cannot add new content', async () => {
        const result = await supertest(web)
            .post('/api/contents')
            .set({'X-API-KEY': 'salah', 'Content-Type': 'application/json'})
            .send({
                name: "test",
                arabic: "test",
                latin: "test",
                translate_id: "test"
            });

        expect(result.body.code).toBe(403);
        expect(result.body.status).toBe("Forbidden");
        expect(result.body.errors).toBeDefined();
    })
})