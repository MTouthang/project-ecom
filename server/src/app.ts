import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

config();

const app = express();

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
