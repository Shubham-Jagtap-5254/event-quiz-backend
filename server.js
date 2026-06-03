require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Lead = require('./models/Lead');

const app = express();
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://event-quiz-f2882.web.app', 'https://event-quiz-frontend.onrender.com'], 
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

// Root Route for Health Check
app.get('/', (req, res) => {
  res.json({ status: 'Server is running', version: '1.1.0' });
});

// Leads Router
const leadsRouter = express.Router();

// POST: Reset all winning tiers to 'None'
leadsRouter.post('/reset-tiers', async (req, res, next) => {
  try {
    const result = await Lead.updateMany({}, { $set: { tier: 'None' } });
    console.log('Reset operation completed:', result);
    res.json({ message: 'All winning tiers have been reset successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Find lead by phone and interest (Required by api.ts)
leadsRouter.get('/by-phone', async (req, res) => {
  try {
    const { phone, interest } = req.query;
    const lead = await Lead.findOne({ phone, interest });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Create initial lead
leadsRouter.post('/', async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH: Update lead information
leadsRouter.patch('/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(lead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET: Admin list with basic filter/sort
leadsRouter.get('/', async (req, res) => {
  try {
    const { interest, sort = 'desc' } = req.query;
    let query = {};
    if (interest && interest !== 'All') {
      query.interest = interest;
    }

    const leads = await Lead.find(query)
      .sort({ created_at: sort === 'desc' ? -1 : 1 });
    
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mount the router
app.use('/api/leads', leadsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});