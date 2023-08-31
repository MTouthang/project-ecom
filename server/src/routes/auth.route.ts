import { Router } from "express";
const router = Router();

import {
  loginUser,
  registerUser,
  userLogout,
} from "../controllers/auth.controller";

router.route("/user/new").post(registerUser);
router.route("/user/login").post(loginUser);
router.route("/user/logout").post(userLogout);

export default router;
