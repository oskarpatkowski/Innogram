import { Router } from "express";
import { logout, refresh, register, authenticate, oauthRegister } from '../controllers/auth.js'
import { validate } from "uuid";

export const authRouter = Router();


authRouter.post('/register', async (req, res) => {
  const data = await register(req.body)
  res.json(data)
})

authRouter.post('/login', async (req, res) => {
  const data = await authenticate(req.body)
  res.json(data)
})

authRouter.post('/validate', async (req, res) => {
  const data = await validate(req.body)
  res.json(data)
})

authRouter.post('/logout', async (req, res) => {
  const data = await logout(req.body)
  res.json(data)
})

authRouter.post('/refresh', async (req, res) => {
  const data = await refresh(req.body.refreshToken, req.body.ipAddress, req.body.userAgent)
  res.json(data)
})

authRouter.post('/oauth/exchange-code', async (req, res) => {
  const data = await oauthRegister(req.body.code, req.body.ipAddress, req.body.userAgent)
  res.json(data)
})

