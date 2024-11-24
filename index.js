const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let wishes = [];

app.get("/api/v1/wishes", (req, res) => {
  res.json(wishes);
});

app.post("/api/v1/wishes", (req, res) => {
  const { content, name } = req.body;

  if (!content || !name) {
    return res.status(400).json({ error: "Content and name are required." });
  }

  const newWish = {
    id: wishes.length + 1,
    content,
    name,
    created_at: new Date(),
  };

  wishes.push(newWish);
  res.status(201).json(newWish);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app;
