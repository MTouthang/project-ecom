import express from "express";
import { config } from "dotenv";
config();

const app = express();

//built-in middleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

export default app;
