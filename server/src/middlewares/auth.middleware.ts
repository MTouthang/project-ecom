import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "./asyncHandler.middleware";
import CustomError from "../utils/customError.utils";
import { IDecodedJwtPayload } from "types";
import { RequestHandler } from "express";

// check for loggedIn
export const isLoggedIn = asyncHandler( async ( req, res, next ) => {
  // get token
  // TODO: make sure proper only jwt token is extracted
  const  token: string | JwtPayload = (req.headers && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) ? req?.headers?.authorization?.split(" ")[1] : ""


  // check for token 
  if(!token) {
    return next(new CustomError("Your not authorized, please login", 401))
  }

  // decode the token 
  const decode = ( await jwt.verify(token, process.env.JWT_SECRET!)) as IDecodedJwtPayload
  if(!decode) {
    return next(new CustomError("Unauthorized, please login", 401))
  } 
  req.user = decode

  next()


})

// authorize roles ---
interface userRoles {
  role: number
}

type IRoles = (number | undefined)[]
// using rest parameters syntax to take infinite number of arguments 
export const authorizeRoles = (...roles:IRoles ):RequestHandler => asyncHandler (async (req, _res, next) => {
  const user = req.user as userRoles

  if(!roles.includes(user.role)) {
    return next(
      new CustomError("Your not authorized to access this route ", 403)
    )
  }
  next()
})