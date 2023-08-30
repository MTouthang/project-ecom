import { Response, Request, NextFunction } from "express";
import asyncHandler from "../middlewares/asyncHandler.middleware";
import User from "../models/User.model";
import CustomError from "../utils/customError.utils";

import { IUserDetails } from "types";

const cookieOption = {
  secure: process.env.NODE_ENV === "production" ? true : false,
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: "none",
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

    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      const errorMessage = `Missing required fields: ${missingFields.join(
        ", ",
      )}`;
      return next(new CustomError(errorMessage, 400));
    }

    // check for user exist
    const userExist = await User.findOne({ email }).lean();
    if (userExist) {
      return next(
        new CustomError("User with provided email already exist!", 409),
      );
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

    // create user mongodb object
    const user = new User(userDetails);

    if (!user) {
      return next(
        new CustomError("User registration fail, please try again", 400),
      );
    }

    //  save user object to the database
    const userData = await user.save();

    if (!userData) {
      return next(new CustomError("User data not able to save", 500));
    }

    // hide user password
    userData.password = undefined;

    const accessToken = await user.generateAccessToken();

    res.cookie("token", accessToken, {
      secure: process.env.NODE_ENV === "production" ? true : false,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
    });

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

export const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // handle missing field
    if (!email) {
      return next(new CustomError("Email should be provided", 400));
    }

    if (!password) {
      return next(new CustomError("Password is missing", 400));
    }

    // check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return next(
        new CustomError(
          "Email and password do not match or user does not exist",
          400,
        ),
      );
    }

    const accessToken = await user.generateAccessToken();

    // pass cookie to request body
    res.cookie("token", accessToken, {
      secure: process.env.NODE_ENV === "production" ? true : false,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
    });

    user.password = undefined;

    return res.status(200).json({
      success: true,
      message: "login successful",
      accessToken,
      user,
    });
  },
);
