import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet"
import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import expressSession from "express-session"
// Route --
import authRoutes from "./routes/auth.route";
import errorHandler from "./middlewares/errorHandler.middleware";


// db configuration 
config();

// passport-js
passport.use(new GoogleStrategy({
  clientID: process.env.G_CLIENT_ID!,
  clientSecret: process.env.G_CLIENT_SECRET!,
  callbackURL: "/api/v1/auth/google/callback"
},
async (accessToken, refreshToken, profile, cb) =>  {
  // User.findOrCreate({ googleId: profile.id }, function (err, user) {
  //   return cb(err, user);
  // });
  console.log("profile ---", profile)
  
  cb(null, profile)
}
));


const app = express();


// use helmet before using any middleware
app.use(helmet())
app.use(expressSession({
  name: "googleSession",
  secret: process.env.EXPRESS_SESSION_KEY!,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false, // set true only when using https 
    maxAge: 1000 * 24 * 60 * 60, // 24 hours in miliseconnds
    httpOnly: true,
    sameSite:'lax'
}
}))
app.use(passport.initialize()) // set-tup passport main passport session
app.use(passport.session())

// add user data to cookie or save the session to the cookie
passport.serializeUser((user, done) =>{
  done(null, user)
})

// load user data from the cookie or read the session from the cookie
passport.deserializeUser((obj:object, done) => {
  done(null, obj)
})


//built-in middleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);


// third party middleware
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));


const apiVersion = "/api/v1";

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
