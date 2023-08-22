import { Router } from "express";
const router = Router();

import { registerUser } from "../controllers/auth.controller";

router.route("/user/new").post(registerUser);

export default router;
