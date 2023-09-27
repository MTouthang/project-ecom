import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "./asyncHandler.middleware";
import CustomError from "utils/customError.utils";



// check for loggedIn
export const isLoggedIn = asyncHandler( async ( req, res, next ) => {

  // get token
  // TODO: make sure proper only jwt token is extracted
  const  token: string |JwtPayload = (req.headers && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) ? req?.headers?.authorization?.split(" ")[1] : ""

  console.log("Token -- ", token)

  // check for token 
  if(!token) {
    return next(new CustomError("Your not authorized, please login", 401))
  }

  // decode the token 
  const decode: string | JwtPayload = await jwt.verify(token, process.env.JWT_SECRET!)
  if(!decode) {
    return next(new CustomError("Unauthorized, please login", 401))
  }
  req.user = decode
  next()

})