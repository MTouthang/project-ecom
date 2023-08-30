import { Router } from "express";
const router = Router();

import { loginUser, registerUser } from "../controllers/auth.controller";

router.route("/user/new").post(registerUser);
router.route("/user/login").post(loginUser);

export default router;
