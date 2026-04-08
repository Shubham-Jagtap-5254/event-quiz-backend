require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Lead = require('./models/Lead');

const app = express();
const corsOptions = {
  origin: ['http://localhost:5173', 'https://event-quiz-frontend.onrender.com'], // Explicitly allow frontend origins
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  });

// POST: Create initial lead
app.post('/api/leads', async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH: Update score/tier after game
app.patch('/api/leads/:id', async (req, res) => {
  try {
    const { best_score, tier } = req.body;
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { best_score, tier },
      { new: true }
    );
    res.json(lead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET: Admin list with basic filter/sort
app.get('/api/leads', async (req, res) => {
  try {
    const { interest, sort = 'desc' } = req.query;
    let query = {};
    if (interest && interest !== 'All') {
      query.interest = interest;
    }

    const leads = await Lead.find(query)
      .sort({ best_score: sort === 'desc' ? -1 : 1 });
    
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});