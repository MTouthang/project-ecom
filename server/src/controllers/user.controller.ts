import {Request, Response, NextFunction } from "express"
import asyncHandler from "../middlewares/asyncHandler.middleware"
import User from "../models/User.model"
import CustomError from "../utils/customError.utils"
import os from "os"
import formidable from 'formidable'
import cloudinary from "cloudinary"


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

/**
 * @UPDATE_USER
 * @ROUTE #POST {{URL}}/api/v1/users/id
 * @return single user with updated user
 * @ACCESS admin only
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
