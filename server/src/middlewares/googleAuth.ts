import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from "passport"
import User from "../models/User.model";
import { IUser } from 'types';
import { nextTick } from 'process';
import CustomError from '../utils/customError.utils';
// passport-js

export const googleAuth =() => {
  passport.use(new GoogleStrategy({
    clientID: process.env.G_CLIENT_ID!,
    clientSecret: process.env.G_CLIENT_SECRET!,
    callbackURL: "/api/v1/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, cb) =>  {
    const firstName = profile?._json?.given_name;
    const lastName = profile?._json?.family_name
    const email = profile?._json?.email ;
    const imageUrl = profile?._json?.picture
    const googleImage = {
      avatar : {
        public_id: email,
        secure_url: imageUrl
      }
    }
    const {avatar} = googleImage

    try {
      // check if user exist or not 
      const user= await User.findOne({email})
      if(user){

        if(!user.avatar){
          // if user does not have avatar, set it from google
        const updateUser = await User.findOneAndUpdate({email}, googleImage, {new:true})
        return cb(null, updateUser as IUser)
     
        }
         // TODO: non-null assertion
      return cb(null, user!)
      } else if(!user){
        const saveUserInfo = new User({
          firstName,
          lastName,
          email,
          avatar,
          created_at: new Date()
        })

        const result = await saveUserInfo.save({validateBeforeSave: false})
        return cb(null, result)
      }
    
    } catch (error) {
      // TODO: double check nextTick()
      cb(error as Error,{ status: false, message: "google auth login error"})
      return nextTick(() => new CustomError("User failed to login with google", 401 ))
      
    }
    
  }
  ));

  // add user data to cookie or save the session to the cookie
passport.serializeUser((user, done) =>{
  done(null, user)
})

// load user data from the cookie or read the session from the cookie
passport.deserializeUser((obj:object, done) => {
  done(null, obj)
})
}

