# MVPCS - AI-Powered Customer Support Demo

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-blue)](https://expressjs.com/)
[![Gemini](https://img.shields.io/badge/Gemini-3.1%20Flash%20Lite-yellow)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

Sebuah MVP (Minimum Viable Product) Customer Support berbasis AI yang menggunakan **Gemini 3.1 Flash Lite** untuk memberikan respons customer support secara otomatis. Aplikasi ini dibangun dengan **Node.js** dan menggunakan **JSON sebagai database sementara**.

## 🎯 Fitur Utama

- ✅ **AI-Powered Responses**: Menggunakan Gemini 3.1 Flash Lite untuk menghasilkan respons support yang cerdas
- ✅ **REST API**: Full REST API untuk mengelola support tickets dan pertanyaan pelanggan
- ✅ **Conversation History**: Menyimpan riwayat percakapan dalam format JSON
- ✅ **Ticket Management**: Buat, lacak, dan selesaikan support tickets
- ✅ **Context Awareness**: Memahami konteks percakapan sebelumnya
- ✅ **Statistics**: Dashboard statistik support tickets

## 📋 Persyaratan

- Node.js v18 atau lebih tinggi
- npm atau yarn
- API Key dari Google Gemini AI

## 🚀 Instalasi

### 1. Clone Repository
```bash
git clone https://github.com/prasmel/mvpcs.git
cd mvpcs
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
cp .env.example .env
```

Edit `.env` dan masukkan API key Anda:
```env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-3.1-flash-lite
PORT=3000
NODE_ENV=development
```

### 4. Jalankan Server

**Development Mode (dengan auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

## 📡 API Endpoints

### 1. Kirim Query Customer Support
**POST** `/api/support/query`

```bash
curl -X POST http://localhost:3000/api/support/query \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "email": "john@example.com",
    "query": "Bagaimana cara reset password?"
  }'
```

**Response:**
```json
{
  "success": true,
  "ticketId": "ticket-1234567890",
  "response": "Untuk mereset password Anda...",
  "confidence": 0.85,
  "timestamp": "2026-05-28T10:30:00Z"
}
```

### 2. Ambil Riwayat Percakapan
**GET** `/api/support/history`

```bash
# Ambil semua percakapan
curl http://localhost:3000/api/support/history

# Ambil percakapan spesifik
curl "http://localhost:3000/api/support/history?ticketId=ticket-1234567890"
```

### 3. Selesaikan Ticket
**POST** `/api/support/resolve`

```bash
curl -X POST http://localhost:3000/api/support/resolve \
  -H "Content-Type: application/json" \
  -d '{
    "ticketId": "ticket-1234567890",
    "resolution": "Issue resolved - password reset link sent"
  }'
```

### 4. Health Check
**GET** `/api/support/health`

```bash
curl http://localhost:3000/api/support/health
```

## 📁 Struktur Folder

```
mvpcs/
├── src/
│   ├── server.js                 # Entry point server
│   ├── controllers/
│   │   └── aiController.js       # Handle API requests
│   ├── services/
│   │   └── geminiService.js      # Integrasi dengan Gemini API
│   ├── middleware/
│   │   └── errorHandler.js       # Error handling middleware
│   └── database/
│       ├── db.js                 # JSON database handler
│       └── conversations.json    # Data storage
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 🔐 Environment Variables

```env
# Google Gemini AI
GEMINI_API_KEY=sk-xxxxx          # API key dari Google AI Studio
GEMINI_MODEL=gemini-3.1-flash-lite  # Model yang digunakan

# Server
PORT=3000                        # Port untuk menjalankan server
NODE_ENV=development             # Environment (development/production)
```

## 📊 Database JSON Structure

Sistem menggunakan JSON untuk menyimpan data percakapan:

```json
{
  "conversations": {
    "ticket-1234567890": {
      "id": "ticket-1234567890",
      "status": "open",
      "resolved": false,
      "createdAt": "2026-05-28T10:00:00Z",
      "lastUpdate": "2026-05-28T10:30:00Z",
      "messages": [
        {
          "type": "exchange",
          "customerName": "John Doe",
          "email": "john@example.com",
          "userQuery": "Bagaimana cara reset password?",
          "aiResponse": "Untuk mereset password...",
          "timestamp": "2026-05-28T10:30:00Z",
          "confidence": 0.85
        }
      ]
    }
  },
  "metadata": {
    "createdAt": "2026-05-28T09:00:00Z",
    "version": "1.0.0"
  }
}
```

## 🔄 Workflow

1. **Customer mengirim query** → POST ke `/api/support/query`
2. **Server menerima request** → Validasi input
3. **Ambil conversation history** → Dari JSON database
4. **Kirim ke Gemini API** → Dengan konteks percakapan
5. **Dapatkan AI response** → Generate respons otomatis
6. **Simpan conversation** → Ke JSON database
7. **Return response** → Ke customer dengan ticket ID

## 🛠️ Development

### Menjalankan dengan Nodemon (Auto-reload)
```bash
npm run dev
```

### Testing API dengan cURL
```bash
# Test query
curl -X POST http://localhost:3000/api/support/query \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "email": "test@example.com",
    "query": "Produk apa yang Anda rekomendasikan untuk pemula?"
  }'
```

## 📝 Catatan Penting

- **Database JSON** digunakan untuk MVP - untuk production, gunakan database yang proper (MongoDB, PostgreSQL, dll)
- **Rate Limiting** - Pertimbangkan menambahkan rate limiting untuk production
- **Authentication** - Tambahkan authentication untuk API endpoints
- **Logging** - Gunakan logging library seperti Winston atau Morgan

## 🚀 Pengembangan Selanjutnya

- [ ] Implementasi database yang lebih robust (MongoDB/PostgreSQL)
- [ ] Authentication & Authorization
- [ ] Rate limiting & throttling
- [ ] Advanced logging & monitoring
- [ ] Dashboard admin untuk melihat statistik
- [ ] Email notifications untuk resolved tickets
- [ ] Sentiment analysis
- [ ] Multi-language support
- [ ] Webhook integration

## 📄 License

MIT License - Lihat file [LICENSE](LICENSE) untuk detail

## 👤 Author

**Prasmel** - [@prasmel](https://github.com/prasmel)

## 🤝 Contributing

Contributions are welcome! Silakan buat pull request dengan improvement atau bug fixes.

## 📞 Support

Jika ada pertanyaan atau issues, silakan buat issue di repository ini.

---

**Built with ❤️ using Gemini AI & Node.js**
