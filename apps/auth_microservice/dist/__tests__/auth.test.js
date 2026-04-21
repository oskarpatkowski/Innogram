import { beforeEach, describe, expect, it, jest } from "@jest/globals";
jest.unstable_mockModule("../data/redisClient.ts", () => ({
    redisClient: {
        on: jest.fn(),
        connect: jest.fn(() => Promise.resolve()),
        quit: jest.fn(() => Promise.resolve()),
        get: jest.fn(),
        setEx: jest.fn(),
        exists: jest.fn(),
        del: jest.fn(),
    },
}));
jest.unstable_mockModule("../data/prismaClient.ts", () => ({
    prismaClient: {
        $connect: jest.fn(() => Promise.resolve()),
        $disconnect: jest.fn(() => Promise.resolve()),
        account: {
            findUnique: jest.fn(),
        },
        profile: {
            findUnique: jest.fn(),
        },
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
        $transaction: jest.fn(),
    },
}));
const { prismaClient } = await import("../data/prismaClient.js");
const { registerUser } = await import("../services/auth.js");
describe("Auth Service - simple tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should be defined", () => {
        expect(registerUser).toBeDefined();
    });
    it("should attempt to find account by email during registration", async () => {
        const signupDto = {
            email: "test@example.com",
            password: "password123",
            username: "testuser",
        };
        prismaClient.account.findUnique.mockResolvedValue(null);
        prismaClient.profile.findUnique.mockResolvedValue(null);
        try {
            await registerUser(signupDto);
        }
        catch {
            //
        }
        expect(prismaClient.account.findUnique).toHaveBeenCalledWith(expect.objectContaining({
            where: { email: signupDto.email },
        }));
    });
    it("should attempt to find account by email during login", async () => {
        const loginDto = {
            email: "login@example.com",
            password: "password123",
        };
        prismaClient.account.findUnique.mockResolvedValue(null);
        try {
            const { authenticateUser } = await import("../services/auth.js");
            await authenticateUser(loginDto);
        }
        catch {
            //
        }
        expect(prismaClient.account.findUnique).toHaveBeenCalledWith(expect.objectContaining({
            where: { email: loginDto.email },
        }));
    });
});
//# sourceMappingURL=auth.test.js.map