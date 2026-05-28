const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const aiController = require('./controllers/aiController');
const { errorHandler } = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.post('/api/support/query', aiController.handleCustomerQuery);
app.get('/api/support/history', aiController.getConversationHistory);
app.post('/api/support/resolve', aiController.resolveTicket);
app.get('/api/support/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 AI Customer Support Server running on http://localhost:${PORT}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/api/docs`);
});

module.exports = app;
