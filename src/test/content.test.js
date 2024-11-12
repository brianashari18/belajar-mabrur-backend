import {createTestContent, removeTestContent} from "./test-util.js";
import supertest from "supertest";
import {web} from "../application/web.js";
import {logger} from "../application/logging.js";
import {prismaClient} from "../application/database.js";

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

        logger.info(result);

        expect(result.body.code).toBe(403);
        expect(result.body.status).toBe("FORBIDDEN");
        expect(result.body.errors).toBeDefined();
    })
})

describe('GET /api/contents', () => {
    beforeEach(async () => {
        await createTestContent();
    })

    beforeEach(async () => {
        await createTestContent();
    })

    it('should get all content', async () => {
        const result = await supertest(web)
            .get('/api/contents')
            .set({'X-API-KEY': process.env.API_KEY});

        logger.info(result.body);
        expect(result.status).toBe(200);
    });

    it('should cannot get all content', async () => {
        const result = await supertest(web)
            .get('/api/contents')
            .set({'X-API-KEY': 'salah'});

        logger.info(result.body);
        expect(result.status).toBe(403);
    });

})

describe('GET /api/contents/:contentId', () => {
    // Setup: Create a test content item before each test
    beforeEach(async () => {
        await createTestContent(); // Assuming this function returns the created content with an ID
    });

    // Cleanup: Remove the test content item after each test
    afterEach(async () => {
        // Remove test content
        await removeTestContent();

        // Reset auto-increment
        await prismaClient.$executeRaw`ALTER TABLE contents AUTO_INCREMENT = 1`;
    });


    it('should get content by ID', async () => {
        const result = await supertest(web)
            .get(`/api/contents/67`)
            .set({'X-API-KEY': process.env.API_KEY});

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.status).toBe("OK");
        expect(result.body.data.id).toBe(67);
        expect(result.body.data.name).toBe("test1");
        expect(result.body.data.arabic).toBe("test");
        expect(result.body.data.latin).toBe("test");
        expect(result.body.data.translate_id).toBe("test");
    });

    it('should return 404 if content not found', async () => {
        const nonExistentId = 99999; // Assuming this ID does not exist
        const result = await supertest(web)
            .get(`/api/contents/1`)
            .set({'X-API-KEY': process.env.API_KEY});

        logger.info(result.body);

        expect(result.body.code).toBe(404);
        expect(result.body.status).toBe("NOT FOUND");
        expect(result.body.errors).toBe("Content not found");
    });

    it('should return 403 if API key is incorrect', async () => {
        const result = await supertest(web)
            .get(`/api/contents/1`)
            .set({'X-API-KEY': 'invalid-api-key'});

        logger.info(result.body);

        expect(result.body.code).toBe(403);
        expect(result.body.status).toBe("FORBIDDEN");
        expect(result.body.errors).toBeDefined();
    });
});

describe('PATCH /api/contents/:contentId', () => {
    let testContent;

    // Setup: Create a test content item before each test
    beforeEach(async () => {
        await createTestContent(); // Assuming this returns the created content with an ID
    });

    // Cleanup: Remove the test content item after each test
    afterEach(async () => {
        await removeTestContent();
    });

    it('should update content by ID', async () => {
        const updatedData = {
            name: "updatedName",
            arabic: "updatedArabic",
            latin: "updatedLatin",
            translate_id: "updatedTranslateId"
        };

        const result = await supertest(web)
            .patch(`/api/contents/67`)
            .set({'X-API-KEY': process.env.API_KEY, 'Content-Type': 'application/json'})
            .send(updatedData);

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.status).toBe("OK");
        expect(result.body.data.name).toBe("updatedName");
        expect(result.body.data.arabic).toBe("updatedArabic");
        expect(result.body.data.latin).toBe("updatedLatin");
        expect(result.body.data.translate_id).toBe("updatedTranslateId");
    });

    it('should return 404 if content not found for update', async () => {
        const nonExistentId = 99999;
        const result = await supertest(web)
            .patch(`/api/contents/${nonExistentId}`)
            .set({'X-API-KEY': process.env.API_KEY})
            .send({
                name: "newName",
                arabic: "newArabic",
                latin: "newLatin",
                translate_id: "newTranslateId"
            });

        logger.info(result.body);

        expect(result.body.code).toBe(404);
        expect(result.body.status).toBe("NOT FOUND");
        expect(result.body.errors).toBe("Content not found");
    });

    it('should return 403 if API key is incorrect for update', async () => {
        const result = await supertest(web)
            .patch(`/api/contents/67`)
            .set({'X-API-KEY': 'invalid-api-key'})
            .send({
                name: "newName",
                arabic: "newArabic",
                latin: "newLatin",
                translate_id: "newTranslateId"
            });

        logger.info(result.body);

        expect(result.body.code).toBe(403);
        expect(result.body.status).toBe("FORBIDDEN");
        expect(result.body.errors).toBeDefined();
    });
});

describe('DELETE /api/contents/:contentId', () => {
    let testContent;

    // Setup: Create a test content item before each test
    beforeEach(async () => {
        testContent = await createTestContent();
    });

    // Cleanup: Reset the auto-increment after each test
    afterEach(async () => {
        await prismaClient.$executeRaw`ALTER TABLE contents AUTO_INCREMENT = 1`;
    });

    it('should delete content by ID', async () => {
        const result = await supertest(web)
            .delete(`/api/contents/${testContent.id}`)
            .set({'X-API-KEY': process.env.API_KEY});

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.status).toBe("OK");
    });

    it('should return 404 if content not found for delete', async () => {
        const nonExistentId = 99999; // Assuming this ID does not exist
        const result = await supertest(web)
            .delete(`/api/contents/${nonExistentId}`)
            .set({'X-API-KEY': process.env.API_KEY});

        logger.info(result.body);

        expect(result.body.code).toBe(404);
        expect(result.body.status).toBe("NOT FOUND");
        expect(result.body.errors).toBe("Content not found");
    });

    it('should return 403 if API key is incorrect for delete', async () => {
        const result = await supertest(web)
            .delete(`/api/contents/${testContent.id}`)
            .set({'X-API-KEY': 'invalid-api-key'});

        logger.info(result.body);

        expect(result.body.code).toBe(403);
        expect(result.body.status).toBe("FORBIDDEN");
        expect(result.body.errors).toBeDefined();
    });
});