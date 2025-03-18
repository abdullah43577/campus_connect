import { RequestHandler, Router } from "express";
import { forgot_password, generate_new_token, login_user, register_user, reset_password, verify_email } from "../controller/auth.controller";
import { validateRefreshToken } from "../helper/validateToken";

const router = Router();

router.post("/register", register_user as RequestHandler);
router.post("/verify_otp", verify_email as RequestHandler);
router.post("/login", login_user as RequestHandler);
router.post("/forgot_password", forgot_password as RequestHandler);
router.post("/reset_password", reset_password as RequestHandler);
router.post("/generate_token", validateRefreshToken as RequestHandler, generate_new_token as RequestHandler);

export { router as authRouter };
