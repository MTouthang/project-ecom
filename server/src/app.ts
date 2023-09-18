import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session"
import passport from "passport"
import GoogleStrategy, { Strategy } from 'passport-google-oauth20'
import expressSession, {SessionOptions} from "express-session"



config();

const app = express();


//built-in middleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

// // google auth Type
// interface IAuth_Option {
//   callbackURL: string
// }

// // google auth options
// const AUTH_OPTIONS = {
//   callbackURL: '/auth/google/callback' as string,
//   clientID: process.env.G_CLIENT_ID as string,
//   clientSecret: process.env.G_CLIENT_SECRET as string
// }

// // verify google auth callback 
// function verifyCallBack(accessToken:string, refreshToken: string, profile:object , done:) {
//   done(null, profile)
// }

passport.use( new Strategy (
  {
    clientID: process.env.G_CLIENT_ID as string,
    clientSecret: process.env.G_CLIENT_SECRET as string, 
           callbackURL: "/auth/google/callback"
  }, 
  (_accessToken, _refreshToken, profile, done) => {
      // get profile details 
      console.log("google profile", profile)
      done(null, profile)
      // save it to the database 
  })
)

// serialize and deserialize 
passport.serializeUser((user, done) => {
  console.log(user)
  done(null, user as object)
})

passport.deserializeUser((obj, done) => {
  console.log("objc", obj)
  done(null, obj as object)
})







// third party middleware
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));

// set up session middleware



// Initialize Passport.js
app.use(passport.initialize())
app.use(passport.session())



// Configure Google OAuth2 Strategy
passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: process.env.G_CLIENT_ID as string,
      clientSecret: process.env.G_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    (accessToken, refreshToken, profile, done) => {
      // Handle user authentication and store user data here
      console.log(profile, done);
    }
  )
);

// serialize and deserialize user ( required for session support)
passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user: string, done) => {
  done(null, user);
});

const apiVersion = "/api/v1";

// Route --
import authRoutes from "./routes/auth.route";
import errorHandler from "./middlewares/errorHandler.middleware";




// health  check route
app.get(`${apiVersion}/health-check`, (_req, res) => {
  res.send("Health status - all good");
});

// auth route -
// error handler
app.use(`${apiVersion}`, authRoutes);

// catch all 404 route
app.all(`${apiVersion}/*`, (_req, res) => {
  res.send("Oops !!, 404 Not Found");
});

app.use(errorHandler);

export default app;
