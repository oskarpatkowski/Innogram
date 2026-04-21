import { Router } from "express";
import { validate } from "uuid";
import { authenticate, logout, oauthInitiate, oauthRegister, refresh, register, } from "../controllers/auth.js";
export const authRouter = Router();
authRouter.post("/register", async (req, res) => {
    const data = await register(req.body);
    res.json(data);
});
authRouter.post("/login", async (req, res) => {
    const data = await authenticate(req.body);
    res.json(data);
});
authRouter.post("/validate", async (req, res) => {
    const data = await validate(req.body);
    res.json(data);
});
authRouter.post("/logout", async (req, res) => {
    const data = await logout(req.body);
    res.json(data);
});
authRouter.post("/refresh", async (req, res) => {
    const data = await refresh(req.body.refreshToken, req.body.ipAddress, req.body.userAgent);
    res.json(data);
});
authRouter.post("/oauth/exchange-code", async (req, res) => {
    const data = await oauthRegister(req.body.code, req.body.ipAddress, req.body.userAgent);
    res.json(data);
});
authRouter.get("/oauth/initiate", async (_req, res) => {
    const data = await oauthInitiate();
    res.json(data);
});
//# sourceMappingURL=router.js.map