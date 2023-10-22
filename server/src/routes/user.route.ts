import { Router } from "express";
import { changePassword, deleteUser, getUserById, getUsers,  } from "../controllers/user.controller";
import { authorizeRoles, isLoggedIn } from "../middlewares/auth.middleware";
const router = Router()


router.route("/users").get(getUsers)
router.route("/users/:_id").get(getUserById)
router.route("/users/me").put()
// change password 
router.route("/user/change-password").put(isLoggedIn, changePassword)
// delete user 
router.route("/user/:_id/delete").delete(isLoggedIn, authorizeRoles(101), deleteUser)

export default router