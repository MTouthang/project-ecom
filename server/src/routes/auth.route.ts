import { Router } from "express";
const router = Router();

import {
  forgotPassword,
  googleLogout,
  handleFailedLogin,
  handleSuccessLogin,
  loginUser,
  registerUser,
  resetPassword,
  userLogout,
  // googleLogin,
  // googleLogout,
  // initiateGoogleAuth,
} from "../controllers/auth.controller";
import passport from "passport";



router.route("/user/new").post(registerUser);
router.route("/user/login").post(loginUser);
router.route("/user/logout").post(userLogout);
router.route("/user/forgotpassword").post(forgotPassword);
router.route("/user/resetpassword/:token").post(resetPassword);
router.route("/failure").get(handleFailedLogin)
router.route("/success").get(handleSuccessLogin)



// 2 google strategy initiator 
router.route("/auth/google").get(passport.authenticate("google", { scope: ['profile', 'email'] }));

router.route("/auth/google/callback").get(
  passport.authenticate("google", {
    failureRedirect: "/api/v1/failure",
    successRedirect: "/api/v1/success" ,
    session: true // TOOD: to be modify
  }))

router.route("/auth/google/logout").get(googleLogout)

export default router;
