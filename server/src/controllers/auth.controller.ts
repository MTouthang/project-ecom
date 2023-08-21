import { Response, Request, NextFunction } from "express";
import asyncHandler from "../middlewares/asyncHandler.middleware";
import User from "../models/User.model";
import CustomError from "../utils/customError.utils";

const cookieOption = {
  secure: process.env.NODE_ENV === "production" ? true : false,
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password, phoneNumber } = req.body;

    const userExist = await User.findOne({ email }).lean();

    if (userExist) {
      return next(
        new CustomError("User with provided email already exist!", 409),
      );
    }

    const user = await User.create({
      firstName,
      lastName,
      password,
      phoneNumber,
      avatar: {
        secure_url:
          "https://res.cloudinary.com/ddvlwqjuy/image/upload/v1692532723/project-ecom/profile_cjhzmm.png",
      },
    });

    if (!user) {
      return next(
        new CustomError("User registration fail, please try again", 400),
      );
    }

    // hide user password
    user.password = undefined;

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
