const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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

// GET /api/v1/wishes
app.get('/api/v1/wishes', async (req, res) => {
  try {
    const wishes = await Wish.find();
    res.status(200).json(wishes);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch wishes' });
  }
});

// POST /api/v1/wishes
app.post('/api/v1/wishes', async (req, res) => {
  const { content, name } = req.body;

  if (!content || !name) {
    return res.status(400).json({ error: 'Content and name are required' });
  }

  try {
    const newWish = new Wish({ content, name });
    await newWish.save();
    res.status(200).json(newWish);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create wish' });
  }
});

// PATCH /api/v1/wishes/:id
app.patch('/api/v1/wishes/:id', async (req, res) => {
  const { id } = req.params;
  const { content, name } = req.body;

  try {
    const updatedWish = await Wish.findByIdAndUpdate(
      id,
      { content, name },
      { new: true, runValidators: true },
    );

    if (!updatedWish) {
      return res.status(404).json({ error: 'Wish not found' });
    }

    res.status(200).json(updatedWish);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update wish' });
  }
});

// DELETE /api/v1/wishes/:id
app.delete('/api/v1/wishes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedWish = await Wish.findByIdAndDelete(id);

    if (!deletedWish) {
      return res.status(404).json({ error: 'Wish not found' });
    }

    res.status(200).json({ message: 'Wish deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete wish' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app;
