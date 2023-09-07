import { Router } from "express";
const router = Router();

import {
  forgotPassword,
  loginUser,
  registerUser,
  resetPassword,
  userLogout,
} from "../controllers/auth.controller";

router.route("/user/new").post(registerUser);
router.route("/user/login").post(loginUser);
router.route("/user/logout").post(userLogout);
router.route("/user/forgotpassword").post(forgotPassword);
router.route("/user/resetpassword/:token").post(resetPassword);

export default router;
