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

    // check for missing fields
    const requiredFields: string[] = [
      "firstName",
      "email",
      "password",
      "phoneNumber",
    ];
    const userExist = await User.findOne({ email }).lean();

    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      const errorMessage = `Missing required fields: ${missingFields.join(
        ", ",
      )}`;
      return next(new CustomError(errorMessage, 400));
    }

    if (userExist) {
      return next(
        new CustomError("User with provided email already exist!", 409),
      );
    }
    interface IUserDetails {
      firstName: string;
      lastName: string;
      email: string;
      avatar: object;
      password: string;
      phoneNumber: string;
    }
    const userDetails: IUserDetails = {
      firstName,
      lastName,
      email,
      avatar: {
        public_id: email,
        secure_url:
          "https://res.cloudinary.com/ddvlwqjuy/image/upload/v1692532723/project-ecom/profile_cjhzmm.png",
      },
      password,
      phoneNumber,
    };

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
