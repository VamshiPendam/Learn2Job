import app from "../server/index.js";

app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

export default app;
