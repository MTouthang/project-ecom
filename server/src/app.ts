import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import passport from "passport"

import expressSession from "express-session"
// Route --
import authRoutes from "./routes/auth.route";
import errorHandler from "./middlewares/errorHandler.middleware";




config();

const app = express();


//built-in middleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(passport.initialize())
app.use(passport.session())




// third party middleware
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));

// set up session middleware
//  session middleware

// 1. Uninitialised = false
// It means that Your session is only Stored into your storage, when any of the Property is modified in req.session
// 2. Uninitialised = true
// It means that Your session will be stored into your storage Everytime for request. It will not depend on the modification of req.session.
// 3. resave = true
// It means when the modification is performed on the session it will re write the req.session.cookie object.
// 4. resave = false
// It will not rewrite the req.session.cookie object. the initial req.session.cookie remains as it is.

app.use(
  expressSession({
    name: "project_ecom",
    secret: process.env.EXPRESS_SESSION_KEY!,
    // store: store,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 24 * 60 * 60, // 24 hours in miliseconnds
      httpOnly: true,
      // sameSite: "Lax"
      
    }
  })
);

// Initialize Passport.js
app.use(passport.initialize())
app.use(passport.session())

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
