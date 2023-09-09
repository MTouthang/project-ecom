import { Response, Request, NextFunction } from "express";
import asyncHandler from "../middlewares/asyncHandler.middleware";
import User from "../models/User.model";
import CustomError from "../utils/customError.utils";
import crypto from "crypto";
// import jwt from "jsonwebtoken";

import { mailHelper } from "../utils/mailHelper.utils";
import {  IUserDetails } from "types";

/**
 * @REGISTRATION
 * @ROUTE @POST {{URL}}/api/v1/user/new
 * @return access token with created user data with user registered massage
 * @ACCESS public
 */
// TODO: check for unique name (optional)
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
    
    // generate access token
    const accessToken = await user.generateAccessToken();
    // generate refreshToken
    // const refreshToken = await user.generateRefreshToken() optional

    // send mail
    const message: string = "Thank you for registering to our application!";
    const subject: string = `Greeting ${userData.firstName}`;
    // TODO:-validate email through mail otp before that user account should be inactive

    // send greetings
    await mailHelper(userData.email, subject, message);

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
    // const refreshToken = await user.generateRefreshToken() (optional)


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

/**
 * @LOGOUT
 * @POST api/v1/user/logout
 * @return Logged out successfully
 * @access public
 */
export const userLogout = asyncHandler(async (_req: Request, res: Response) => {
  res
    .cookie("accessToken", null, {
      // expires: new Date(Date.now()),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      maxAge: 1,
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

/**
 * @FORGOTPASSWORD
 * @POST api/v1/user/forgotpassword
 * @return password change successfully
 */
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      return next(new CustomError("Email should be provided", 400));
    }

    const userData = await User.findOne({ email });

    if (!userData) {
      return next(
        new CustomError(
          `User not available for the provided email - ${email}`,
          404,
        ),
      );
    }

    

    // generate random reset password token
    const resetPasswordToken = await userData.generatePasswordResetToken();
    await userData.save();

    // password url token
    const resetPasswordUrl: string = `${req.protocol}://${req.get(
      "host",
    )}/api/v1/user/resetpassword/${resetPasswordToken}`;

    // create mail and send
    const subject: string = "Password Reset";
    const message: string = `Here is your password reset url click to reset your password ${resetPasswordUrl}`;

    try {
      await mailHelper(email, subject, message);
      res.status(200).json({
        success: true,
        message: `Password reset token send to ${email} successfully`,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      userData.resetPasswordExpiry = undefined;
      userData.resetPasswordToken = undefined;

      await userData.save();

      return next(
        new CustomError(
          error.message || "Something went wrong, please try again.",
          400,
        ),
      );
    }
  },
);

/**
 * @RESET_PASSWORD
 * @ROUTE @POST
 * @returns Password change successfully
 * @ACCESS Public
 */
export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    const { password } = req.body;

    const resetPasswordToken: string = await crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new CustomError(
          "Reset password is invalid or expired, please try again",
          400,
        ),
      );
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();
    const email: string = user.email;
    const subject: string = "Password Changed Successfully ";
    const message: string = "Your Password has been changed Successfully ";
    let isMailSend: boolean = false;
    try {
      await mailHelper(email, subject, message);
      isMailSend = true;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      isMailSend = false;
    }

    res.status(200).json({
      success: true,
      message: "Password updated successfully, please login",
      email: isMailSend
        ? "User update password sent successfully"
        : "User failed to update password",
    });
  },
);
// optional
/**
 * @REFRESHTOKEN
 * @ROUTE @POST api/v1/user/refreshtoken
 * @returns new refresh token if token is valid
 * @ACCESS Public
 */
// export const refreshToken = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { token } = req.cookies;

//     if (!token) {
//       return next(new CustomError("Token NA, please login", 404));
//     }

//     const decodeToken = (await jwt.verify(
//       token,
//       process.env.REFRESH_TOKEN_SECRET as string,
//     )) as IDecodedJwtPayload;

//     if (!decodeToken) {
//       return next(
//         new CustomError("Invalid token, please login and check again", 400),
//       );
//     }

//     const user = await User.findById(decodeToken.user_id);

//     if (!user) {
//       return next(new CustomError("Unauthorized, please login", 401));
//     }

//     const accessToken = await user.generateAccessToken();

//     res.status(200).json({
//       success: true,
//       message: "Access token refreshed successfully",
//       accessToken,
//     });
//   },
// );

// TODO:
// 
// generate refresh token (optional)
// check auth route
// Oauth route
