import { Router } from "express";
import { changePassword, deleteUser, getUserById, getUsers, updateUser } from "../controllers/user.controller";
import { authorizeRoles, isLoggedIn } from "../middlewares/auth.middleware";
const router = Router()


router.route("/users").get(getUsers)
router.route("/users/:userId").get(getUserById)
router.route("/users/:userId").put(updateUser)
// change password 
router.route("/user/change-password").put(isLoggedIn, changePassword)
// delete user 
router.route("/user/:userId/delete").delete(isLoggedIn, authorizeRoles(101), deleteUser)

export default router