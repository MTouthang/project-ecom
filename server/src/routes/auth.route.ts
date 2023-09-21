import { Router } from "express";
const router = Router();

import {
  forgotPassword,
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

// google strategy
router.route("/google").get(() => {
  passport.authenticate("google",{ scope: ['profile', "email"] })
})

router.route("/google/callback").get(() => {
  passport.authenticate("google", {
    // TODO: cross check the url and define the .env
    failureRedirect: "/signin",
    successRedirect: process.env.APP_URL 
  })
})

export default router;
