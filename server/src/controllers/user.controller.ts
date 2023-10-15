import {Request, Response, NextFunction } from "express"
import asyncHandler from "../middlewares/asyncHandler.middleware"
import User from "../models/User.model"
import CustomError from "../utils/customError.utils"
import os from "os"
import formidable from 'formidable'
import cloudinary from "cloudinary"
import { ObjectId } from "mongoose"
import { mailHelper } from "../utils/mailHelper.utils"


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
  const {userId} = req.params 
  
  const user = await User.findById(userId)

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
export const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    
    const {userId} = req.params
    const form = formidable({
      keepExtensions: true,
      uploadDir: os.tmpdir(),
      maxFileSize: 50 * 1024 * 1024, // 5MB
    });

     form.parse(req, async (err, fields, files ) => {
      
      if (err) {
        return next(new CustomError(err || 'Something went wrong', 500));
      }

      try {
        const user = await User.findByIdAndUpdate(
          userId,
          {
            $set: fields,
          },
          {
            new: true,
          },
        ); 

      
        if (!user) {
          return next(new CustomError('Error updating user, please try again', 400));
        }

        if (files && files.userImage) {
          try {
            await cloudinary.v2.uploader.destroy(user.avatar.public_id)
            
            const incomingFile = files.userImage
            
            const persistentFile = incomingFile[0]

          //  only single file
            if (persistentFile?.filepath.length > 0) {
              const result = await cloudinary.v2.uploader.upload(
                persistentFile.filepath,
                {
                  folder: 'ecom/users',
                },
              );

              if (result) {
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;
              }
            }
          } catch (error) {
            return next(new CustomError('Image could not be uploaded', 400));
          }
        }

        await user.save();

        res.status(200).json({
          success: true,
          message: 'User updated successfully',
          user,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        return next(
          new CustomError(
            error ||
              'Something went wrong while updating the user, please try again',
            500,
          ),
        );
      }
    });
  
  },
);

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
