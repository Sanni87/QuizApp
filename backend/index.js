const express = require("express");
const cors = require("cors");

const quizRoutes = require("./routes/quiz");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/quizzes", quizRoutes);

app.get("/health", (_, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`Quiz API running on http://localhost:${PORT}`);
});
