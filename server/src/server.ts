import app from "./app";
import dbConnection from "./configs/db.config";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App is up and running at http://localhost:${PORT}`);
  dbConnection();
});
