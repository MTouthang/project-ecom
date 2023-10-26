import { Response, Request, NextFunction } from "express";
import { ObjectId, Types } from "mongoose";

// interface for custom Error
export interface ICustomError extends Error {
  statusCode: number;
}

// async handler interface
export interface IAsyncHandlerFunc {
  (req: Request, res: Response, next: NextFunction): Promise<unknown>;
}

// user model Interface
export interface IUser {
  _id: ObjectId,
  firstName: string;
  lastName: string;
  email: string;

  password: string | undefined;
  phoneNumber: string;
  role: number;
  avatar: {
    public_id: string;
    secure_url: string;
  };
  addresses: Types.ObjectId[];
  resetPasswordToken?: string | undefined;
  resetPasswordExpiry?: Date | undefined;

  comparePassword(password: string): boolean;
  generateAccessToken(): string;
  generateRefreshToken(): string
  generatePasswordResetToken(): string;
}

// error return object interface
export interface IErrorObject {
  statusCode: number;
  success: boolean;
  message: string;
  data: null;
  stack?: string;
}

// user object interface
export interface IUserDetails {
  firstName: string;
  lastName: string;
  email: string;
  avatar: object;
  password: string;
  phoneNumber: string;
}

// interface for decoded token
export interface IDecodedJwtPayload {
  _id: string;
  role: number;
}


// interface for Address
export interface IAddress {
  name: string,
  phoneNumber: string,
  houseNumber: string,
  state: string,
  city: string,
  pinCode?: string
  landMark?: string,
  isPrimary?: boolean
}