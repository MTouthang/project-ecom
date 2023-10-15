import { Router } from "express";
import { getUserById, getUsers, updateUser } from "../controllers/user.controller";
const router = Router()


router.route("/users").get(getUsers)
router.route("/users/:userId").get(getUserById)
router.route("/users/:userId").put(updateUser)

export default router