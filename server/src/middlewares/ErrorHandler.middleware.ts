/* eslint-disable @typescript-eslint/no-unused-vars */

import CustomError from "@/utils/customError.utils";
import { Response, Request, NextFunction, ErrorRequestHandler } from "express";
const ErrorHandler: ErrorRequestHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Something went wrong";

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: err.stack,
  });
};

export default ErrorHandler;
