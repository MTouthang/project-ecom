import { Response, Request, NextFunction } from "express";

// interface for custom Error
export interface ICustomError extends Error {
  statusCode: number;
}

// async handler interface
export interface IAsyncHandlerFunc {
  (req: Request, res: Response, next: NextFunction): Promise<undefined>;
}
