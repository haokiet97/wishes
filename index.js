const express = require('express');
const cors = require('cors');
const _ = require('lodash');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let wishes = [];

// GET /api/v1/wishes
app.get('/api/v1/wishes', (req, res) => {
  res.status(200).json(wishes);
});

// POST /api/v1/wishes
app.post('/api/v1/wishes', (req, res) => {
  const { content, name } = req.body;

  if (!content || !name) {
    return res.status(400).json({ error: 'Content and name are required.' });
  }

  const newWish = {
    id: _.size(wishes.length) + 1,
    content,
    name,
    created_at: new Date(),
  };

  wishes.push(newWish);
  res.status(200).json(newWish);
});

// PATCH /api/v1/wishes/:id
app.patch('/api/v1/wishes/:id', (req, res) => {
  const { id } = req.params;
  const { content, name } = req.body;

  const wish = _.find(wishes, { id: Number(id) });

  if (!wish) {
    return res.status(404).json({ error: 'Wish not found' });
  }

  _.assign(wish, { content, name });
  res.status(200).json(wish);
});

// DELETE /api/v1/wishes/:id
app.delete('/api/v1/wishes/:id', (req, res) => {
  const { id } = req.params;

  const wish = _.remove(wishes, { id: Number(id) });

  if (_.isEmpty(wish)) {
    return res.status(404).json({ error: 'Wish not found' });
  }

  res.status(200).json(wish[0]);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app;
