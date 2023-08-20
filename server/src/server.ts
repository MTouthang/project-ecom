import app from "./app";
import dbConnection from "./configs/db.config";

const PORT = process.env.PORT || 500;

// health  check route
app.get("/health-check", (_req, res) => {
  res.send("Health status - all good");
});

// catch all 404 route
app.all("*", (_req, res) => {
  res.send("Oops !!, 404 Not Found");
});

app.listen(PORT, () => {
  console.log(`App is up and running at http://localhost:${PORT}`);
  dbConnection();
});
