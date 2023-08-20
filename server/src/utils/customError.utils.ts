import { ICustomError } from "@/types";

class CustomError extends Error implements ICustomError {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
