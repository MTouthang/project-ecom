import app from "./app";
import dbConnection from "./configs/db.config";

const PORT = process.env.PORT || 500;
const apiVersion = "/api/v1";

// Route --
import authRoutes from "./routes/auth.route";

// health  check route
app.get(`${apiVersion}/health-check`, (_req, res) => {
  res.send("Health status - all good");
});

// auth route -
app.use(`${apiVersion}/`, authRoutes);

// catch all 404 route
app.all(`${apiVersion}/*`, (_req, res) => {
  res.send("Oops !!, 404 Not Found");
});

app.listen(PORT, () => {
  console.log(`App is up and running at http://localhost:${PORT}`);
  dbConnection();
});
