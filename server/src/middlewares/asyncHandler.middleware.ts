import { IAsyncHandlerFunc } from "../types";

import { Request, Response, NextFunction } from "express";

const asyncHandler = (func: IAsyncHandlerFunc) => {
  return (req: Request, res: Response, next: NextFunction) => {
    func(req, res, next).catch((error) => next(error));
  };
};

export default asyncHandler;
