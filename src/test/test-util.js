import {prismaClient} from "../application/database.js";
import bcrypt from "bcrypt";

export const removeTestUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            username: "test"
        }
    })
}

export const createTestUser = async () => {
    await prismaClient.user.create({
        data: {
            username: "test",
            password: await bcrypt.hash("rahasia", 10),
            name: "test",
            token: "test"
        }
    })
}

export const getTestUser = async () => {
    return prismaClient.user.findUnique({
        where: {
            username: "test"
        }
    });
}

export const removeTestContent = async () => {
    await prismaClient.content.deleteMany({
        where: {
            name: "test",
            arabic: "test",
        }
    })
}

export const createTestContent = async () => {
    return prismaClient.content.create({
        data: {
            name: "test",
            category: "test",
            arabic: "test",
            latin: "test",
            translate_id: "test",
            description: "test"
        }
    })
}