import { RequestHandler, Router } from "express";
import { generate_new_token, login_user, register_user, verifyOTP } from "../controller/auth.controller";
import { validateRefreshToken } from "../helper/validateToken";

const router = Router();

router.post("/register", register_user);
router.post("/login", login_user as RequestHandler);
router.post("/verify_otp", verifyOTP as RequestHandler);
router.post("/generate_token", validateRefreshToken as RequestHandler, generate_new_token as RequestHandler);

export { router as authRouter };
