const geminiService = require('../services/geminiService');
const database = require('../database/db');
const { v4: uuidv4 } = require('crypto').randomUUID;

// Handle customer support queries
const handleCustomerQuery = async (req, res) => {
  try {
    const { customerName, email, query, conversationId } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const ticketId = conversationId || `ticket-${Date.now()}`;

    // Get conversation context
    const history = database.getConversationHistory(ticketId);
    
    // Call Gemini AI
    const aiResponse = await geminiService.generateResponse(query, history);

    // Store conversation
    const conversation = {
      id: ticketId,
      customerName: customerName || 'Anonymous',
      email: email || 'unknown@example.com',
      userQuery: query,
      aiResponse: aiResponse.text,
      timestamp: new Date().toISOString(),
      confidence: aiResponse.confidence || 0.8
    };

    database.saveConversation(ticketId, conversation);

    res.status(200).json({
      success: true,
      ticketId,
      response: aiResponse.text,
      confidence: aiResponse.confidence,
      timestamp: conversation.timestamp
    });
  } catch (error) {
    console.error('Error handling query:', error);
    res.status(500).json({ 
      error: 'Failed to process query',
      message: error.message 
    });
  }
};

// Get conversation history
const getConversationHistory = async (req, res) => {
  try {
    const { ticketId } = req.query;

    if (!ticketId) {
      const allConversations = database.getAllConversations();
      return res.status(200).json({
        success: true,
        count: allConversations.length,
        conversations: allConversations
      });
    }

    const history = database.getConversationHistory(ticketId);
    res.status(200).json({
      success: true,
      ticketId,
      history
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve history' });
  }
};

// Resolve a support ticket
const resolveTicket = async (req, res) => {
  try {
    const { ticketId, resolution } = req.body;

    if (!ticketId) {
      return res.status(400).json({ error: 'Ticket ID is required' });
    }

    database.resolveTicket(ticketId, resolution);

    res.status(200).json({
      success: true,
      message: `Ticket ${ticketId} resolved`,
      resolvedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to resolve ticket' });
  }
};

module.exports = {
  handleCustomerQuery,
  getConversationHistory,
  resolveTicket
};
