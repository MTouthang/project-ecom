import { Response, Request, NextFunction } from "express";
import { Types } from "mongoose";

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
  firstName: string;
  lastName: string;
  email: string;

  password: string | undefined;
  phoneNumber: string;
  role: string;
  avatar: {
    public_id: string;
    secure_url: string;
  };
  addresses: Types.ObjectId[];
  resetPasswordToken?: string;
  resetPasswordExpiry: Date;

  comparePassword(password: string): boolean;
  generateAccessToken(): string;

  generatePasswordResetToken(): string;
}