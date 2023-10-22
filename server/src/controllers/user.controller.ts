import {Request, Response, NextFunction } from "express"
import asyncHandler from "../middlewares/asyncHandler.middleware"
import User from "../models/User.model"
import CustomError from "../utils/customError.utils"
import cloudinary from "cloudinary"
import { mailHelper } from "../utils/mailHelper.utils"
import { ObjectId } from "mongoose"
import { IUser } from "types"



/**
 * @GET_USER 
 * @ROUTE #GET {{URL}}/api/v1/users/
 * @return list of all the users 
 * @ACCESS admin only
 */
export const getUsers = asyncHandler( async (req:Request, res:Response, next:NextFunction) => {
    const users = await User.find()

    //TODO: return all user except the admin user

    if(!users.length) {
      return next( new CustomError("User not able to fetch at this moment!", 404))
    }
     res.status(200).json({
      success: true,
      message: "User fetched successfully",
      users
    })
})

/**
 * @GET_USER_BY_ID
 * @ROUTE #GET {{URL}}/api/v1/users/id
 * @return single user base on the provided id  
 * @ACCESS admin only
 */
export const getUserById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const {_id} = req.params 
  
  const user = await User.findById(_id)

  if(!user){
    return next(new CustomError("Invalid User Id or User does not exist", 400))
  }

  res.status(200).json({
    success: true, 
    message: "User fetch successfully",
    user
  })
})

// TODO: fix fields update 
/**
 * @UPDATE_USER
 * @ROUTE #POST {{URL}}/api/v1/users/id
 * @return single user with updated user
 * @ACCESS private particular user
 */
// export const updateUser = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const {_id} =req.user as IUser
//   } 
// );

/**
 * @CHANGE_PASSWORD 
 * @ROUTE #POST {{URL}}/api/v1/users/change-password
 * @return password changed successfully + notify it via email 
 * @ACCESS private logged in user only
 */
export const changePassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const {oldPassword, newPassword} = req.body
  

  interface userTypes {
    user_id: ObjectId
  }
  const {user_id} = req.user as userTypes

  if(!oldPassword || !newPassword){
    return next(new CustomError("Old password and new password should be provided", 400))
  }

  const user = await User.findById(user_id).select("+password")

  if(!(user && (await user.comparePassword(oldPassword)))) {
    return next(new CustomError("Password is incorrect", 400))
  }

  user.password = newPassword
  user.save()

  try {
    const message: string = "You account password is change successfully, Kindly reset if it is not done by you"
    const subject: string = "Project Ecom password changed successfully"
    await mailHelper(user.email, subject, message);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    return next( new CustomError("error.message || Failed to send message",400))
  }

  user.password = undefined

  res.status(200).json({
    success: true,
    message: "Password changed successfully"
  })
})


/**
 * TODO: send mail and notify the user , account has been deleted
 * @DELETE_USER 
 * @ROUTE #POST {{URL}}/api/v1/user/:userId/delete
 * @return successfully delete user account and send mail
 * @ACCESS private only admin
 */
export const deleteUser = asyncHandler(async (req:Request, res:Response, next: NextFunction) => {
  const {userId} = req.params

  const user = await User.findById(userId)

  if(!user)  {
    return next(new CustomError("Invalid user Id or User does not exist", 400))
  }
  // delete profile pic as well
  if(user.avatar.public_id){
    try {
      await cloudinary.v2.uploader.destroy(user?.avatar?.public_id)
    } catch (error){
      return next(new CustomError("Image could nto be deleted", 400))
    }
  }

   await User.findByIdAndDelete(userId)

  res.status(200).json({
    success: true,
    message: 'user deleted successfully'
  })

})
