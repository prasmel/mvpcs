const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'conversations.json');

const ensureDbExists = () => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({
      conversations: {},
      metadata: {
        createdAt: new Date().toISOString(),
        version: '1.0.0'
      }
    }, null, 2));
  }
};

const readDb = () => {
  ensureDbExists();
  const data = fs.readFileSync(DB_FILE, 'utf8');
  return JSON.parse(data);
};

const writeDb = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

const saveConversation = (ticketId, conversation) => {
  const db = readDb();
  
  if (!db.conversations[ticketId]) {
    db.conversations[ticketId] = {
      id: ticketId,
      messages: [],
      createdAt: new Date().toISOString(),
      status: 'open',
      resolved: false
    };
  }

  db.conversations[ticketId].messages.push({
    type: 'exchange',
    ...conversation
  });

  db.conversations[ticketId].lastUpdate = new Date().toISOString();
  
  writeDb(db);
};

const getConversationHistory = (ticketId) => {
  const db = readDb();
  if (db.conversations[ticketId]) {
    return db.conversations[ticketId].messages || [];
  }
  return [];
};

const getAllConversations = () => {
  const db = readDb();
  return Object.values(db.conversations).map(conv => ({
    ...conv,
    messageCount: conv.messages?.length || 0
  }));
};

const resolveTicket = (ticketId, resolution = '') => {
  const db = readDb();
  
  if (db.conversations[ticketId]) {
    db.conversations[ticketId].status = 'resolved';
    db.conversations[ticketId].resolved = true;
    db.conversations[ticketId].resolvedAt = new Date().toISOString();
    db.conversations[ticketId].resolution = resolution;
    writeDb(db);
  }
};

const deleteConversation = (ticketId) => {
  const db = readDb();
  if (db.conversations[ticketId]) {
    delete db.conversations[ticketId];
    writeDb(db);
  }
};

const getStatistics = () => {
  const db = readDb();
  const conversations = Object.values(db.conversations);
  
  return {
    totalConversations: conversations.length,
    openTickets: conversations.filter(c => !c.resolved).length,
    resolvedTickets: conversations.filter(c => c.resolved).length,
    totalMessages: conversations.reduce((sum, c) => sum + (c.messages?.length || 0), 0)
  };
};

module.exports = {
  saveConversation,
  getConversationHistory,
  getAllConversations,
  resolveTicket,
  deleteConversation,
  getStatistics
};
