import { Router } from "express";
const router = Router();

import { registerUser } from "@/controllers/auth.controller";

router.route("/auth").post(registerUser);

export default router;
