import app from "./app";

const PORT = process.env.PORT || 500;

app.get("/health-check", (_req, res) => {
  res.send("Health status - all good");
});

app.listen(PORT, () => {
  console.log(`App is up and running at http://localhost:${PORT}`);
});
