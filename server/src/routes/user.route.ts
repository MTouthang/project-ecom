import { Router } from "express";
import { changePassword, getUserById, getUsers, updateUser } from "../controllers/user.controller";
import { isLoggedIn } from "../middlewares/auth.middleware";
const router = Router()


router.route("/users").get(getUsers)
router.route("/users/:userId").get(getUserById)
router.route("/users/:userId").put(updateUser)
// change password 
router.route("/user/change-password").put(isLoggedIn, changePassword)

export default router