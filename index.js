const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const wishSchema = new mongoose.Schema({
  content: { type: String, required: true },
  name: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const Wish = mongoose.model('Wish', wishSchema);

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// GET /v1/wishes
app.get('/v1/wishes', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const currentPage = Math.max(1, parseInt(page, 10));
    const itemsPerPage = Math.max(1, parseInt(limit, 10));
    const skip = (currentPage - 1) * itemsPerPage;

    const wishes = await Wish.find().sort({ created_at: -1 }).skip(skip).limit(itemsPerPage);
    const totalItems = await Wish.countDocuments();

    res.status(200).json({
      data: wishes,
      meta: {
        totalItems,
        currentPage,
        totalPages: Math.ceil(totalItems / itemsPerPage),
        itemsPerPage,
      },
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch wishes' });
  }
});

// POST /v1/wishes
app.post('/v1/wishes', async (req, res) => {
  const { content, name } = req.body;

  if (!name) return res.status(400).json({ error: 'Name is required' });
  if (!content) return res.status(400).json({ error: 'Content is required' });

  try {
    const newWish = new Wish({ content, name });
    await newWish.save();
    res.status(200).json(newWish);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create wish' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app;
