require('dotenv').config();

console.log("=== ENV DEBUG ===");
console.log("BREVO_API_KEY:", process.env.BREVO_API_KEY ? process.env.BREVO_API_KEY.slice(0,10) + '...' : 'UNDEFINED');
console.log("SMTP_USER:", process.env.SMTP_USER || 'UNDEFINED');

// Initialize App
const app = express();

// Connect Database with retries (no crash)
connectDB().catch(() => {
  console.log('Initial DB connect failed - server continues (retries ongoing)');
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;