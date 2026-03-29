import app from "../server/index.js";

app.get("/api/status", (req, res) => {
  res.send("Backend working 🚀");
});

export default app;
