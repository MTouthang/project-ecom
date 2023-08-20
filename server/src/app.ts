import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookiePasrser from "cookie-parser";
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
app.use(cookiePasrser());
app.use(cors());
app.use(morgan("dev"));

export default app;
