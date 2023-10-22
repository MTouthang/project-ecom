import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet"
import passport from "passport";
import expressSession from "express-session"
import cloudinary from "cloudinary"
import fileUpload from "express-fileupload"
// Route --
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route"
import errorHandler from "./middlewares/errorHandler.middleware";
import { googleAuth } from "./middlewares/googleAuth";


// db configuration 
config();
googleAuth()


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


//built-in middleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

// express file upload config
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 5 * 1024 * 1024 }
  })
)


// third party middleware
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const apiVersion = "/api/v1";

// health  check route
app.get(`${apiVersion}/health-check`, (_req, res) => {
  res.send("Health status - all good");
});

// auth route -
// error handler
app.use(`${apiVersion}`, authRoutes);
app.use(`${apiVersion}`, userRoutes)

// catch all 404 route
app.all(`${apiVersion}/*`, (_req, res) => {
  res.send("Oops !!, 404 Not Found");
});

app.use(errorHandler);

export default app;
