import { Response, Request, NextFunction } from "express";
import asyncHandler from "../middlewares/asyncHandler.middleware";
import User from "../models/User.model";
import CustomError from "../utils/customError.utils";

const cookieOption = {
  secure: process.env.NODE_ENV === "production" ? true : false,
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

/**
 * @REGISTRATION
 * @ROUTE @POST {{URL}}/api/v1/user/new
 * @return access token with created user data with user registered massage
 * @ACCESS public
 */

export const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password, phoneNumber } = req.body;

    if (!email) {
      return next(new CustomError("email missing", 404));
    }

    const isPresent = await User.findOne({ email: email }).lean();

    if (isPresent) {
      return next(new CustomError("User already present!", 404));
    }

    interface IUser {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
      phoneNumber?: string;
      avatar?: object;
    }
    // check for missing fields
    const userDetails: IUser = {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      avatar: {
        public_id: email,
        secure_url:
          "https://res.cloudinary.com/ddvlwqjuy/image/upload/v1692532723/project-ecom/profile_cjhzmm.png",
      },
    };
    const requiredFields: string[] = [
      "firstName",
      "lastName",
      "email",
      "password",
      "phoneNumber",
      "avatar",
    ];

    const missingField: string[] = requiredFields.filter(
      (field: string) => !userDetails[field as keyof IUser],
    );
    if (missingField.length <= 0) {
      const fieldRequired: string = missingField[0];
      return next(new CustomError(`Missing Field - ${fieldRequired}`, 400));
    }

    const userExist = await User.findOne({ email }).lean();

    if (userExist) {
      return next(
        new CustomError("User with provided email already exist!", 409),
      );
    }

    const user = new User(userDetails);

    if (!user) {
      return next(
        new CustomError("User registration fail, please try again", 400),
      );
    }

    const userData = await user.save();

    if (!userData) {
      return next(new CustomError("User data not able to save", 500));
    }

    // hide user password
    userData.password = undefined;

    const accessToken = await user.generateAccessToken();

    res.cookie("token", accessToken, cookieOption);

    res.status(201).json({
      success: true,
      message: "User created Successfully ",
      accessToken,
      user,
    });
  },
);

/**
 * @LOGIN
 * @ROUTE @POST {{URL}}/api/v1/user/login
 * @return access token and user logged in successfully message
 * @ACCESS public
 */
// export const loginUser = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { email, password } = req.body;

//     if (!email) {
//       return next(new CustomError(""));
//     }
//   },
// );
