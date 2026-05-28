# Contoh Request API MVPCS

## 1. Query Customer Support

### Request dengan Ticket ID Baru
```bash
curl -X POST http://localhost:3000/api/support/query \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Ahmad Rizki",
    "email": "ahmad@example.com",
    "query": "Saya tidak bisa login ke akun saya, bagaimana cara mengatasinya?"
  }'
```

### Response
```json
{
  "success": true,
  "ticketId": "ticket-1685263800000",
  "response": "Halo Ahmad Rizki! Saya akan membantu Anda mengatasi masalah login. Berikut beberapa langkah yang dapat Anda coba:

1. Periksa koneksi internet Anda
2. Pastikan Caps Lock tidak aktif saat memasukkan password
3. Coba reset password menggunakan fitur 'Lupa Password'
4. Bersihkan cache dan cookies browser Anda
5. Gunakan browser yang berbeda untuk mengecek apakah masalahnya terkait dengan browser

Jika masalah masih berlanjut, silakan berikan detail error yang Anda terima.",
  "confidence": 0.85,
  "timestamp": "2026-05-28T10:30:00Z"
}
```

## 2. Follow-up pada Ticket yang Sama

### Request dengan Conversation ID
```bash
curl -X POST http://localhost:3000/api/support/query \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Ahmad Rizki",
    "email": "ahmad@example.com",
    "query": "Saya sudah coba reset password, tapi email reset tidak masuk",
    "conversationId": "ticket-1685263800000"
  }'
```

### Response
```json
{
  "success": true,
  "ticketId": "ticket-1685263800000",
  "response": "Baik, terima kasih telah mencoba langkah-langkah tersebut. Email reset password seringkali masuk ke folder spam atau delay. Mari kita coba:

1. Periksa folder Spam/Junk di email Anda
2. Tunggu 5-10 menit untuk email tiba
3. Pastikan email yang terdaftar sudah benar di sistem kami
4. Jika masih tidak ada, kami bisa mengirim ulang email reset

Apakah email Anda sudah benar? Kami siap mengirim ulang jika diperlukan.",
  "confidence": 0.88,
  "timestamp": "2026-05-28T10:35:00Z"
}
```

## 3. Ambil Riwayat Percakapan

### Ambil Semua Percakapan
```bash
curl http://localhost:3000/api/support/history
```

### Response
```json
{
  "success": true,
  "count": 2,
  "conversations": [
    {
      "id": "ticket-1685263800000",
      "status": "open",
      "resolved": false,
      "createdAt": "2026-05-28T10:30:00Z",
      "lastUpdate": "2026-05-28T10:35:00Z",
      "messageCount": 2
    },
    {
      "id": "ticket-1685263600000",
      "status": "open",
      "resolved": false,
      "createdAt": "2026-05-28T10:15:00Z",
      "lastUpdate": "2026-05-28T10:20:00Z",
      "messageCount": 1
    }
  ]
}
```

### Ambil Percakapan Spesifik
```bash
curl "http://localhost:3000/api/support/history?ticketId=ticket-1685263800000"
```

### Response
```json
{
  "success": true,
  "ticketId": "ticket-1685263800000",
  "history": [
    {
      "type": "exchange",
      "customerName": "Ahmad Rizki",
      "email": "ahmad@example.com",
      "userQuery": "Saya tidak bisa login ke akun saya, bagaimana cara mengatasinya?",
      "aiResponse": "Halo Ahmad Rizki! Saya akan membantu Anda...",
      "timestamp": "2026-05-28T10:30:00Z",
      "confidence": 0.85
    },
    {
      "type": "exchange",
      "customerName": "Ahmad Rizki",
      "email": "ahmad@example.com",
      "userQuery": "Saya sudah coba reset password, tapi email reset tidak masuk",
      "aiResponse": "Baik, terima kasih telah mencoba langkah-langkah tersebut...",
      "timestamp": "2026-05-28T10:35:00Z",
      "confidence": 0.88
    }
  ]
}
```

## 4. Selesaikan Ticket

```bash
curl -X POST http://localhost:3000/api/support/resolve \
  -H "Content-Type: application/json" \
  -d '{
    "ticketId": "ticket-1685263800000",
    "resolution": "Customer berhasil login setelah reset password. Email reset ditemukan di folder spam."
  }'
```

### Response
```json
{
  "success": true,
  "message": "Ticket ticket-1685263800000 resolved",
  "resolvedAt": "2026-05-28T10:40:00Z"
}
```

## 5. Health Check

```bash
curl http://localhost:3000/api/support/health
```

### Response
```json
{
  "status": "healthy",
  "timestamp": "2026-05-28T10:45:00Z"
}
```

## 6. Contoh dengan JavaScript/Fetch

```javascript
// Kirim query
async function sendCustomerQuery() {
  const response = await fetch('http://localhost:3000/api/support/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      customerName: 'Ahmad Rizki',
      email: 'ahmad@example.com',
      query: 'Bagaimana cara membatalkan subscription?'
    })
  });

  const data = await response.json();
  console.log('Ticket ID:', data.ticketId);
  console.log('AI Response:', data.response);
  return data;
}

// Ambil riwayat
async function getHistory(ticketId) {
  const response = await fetch(
    `http://localhost:3000/api/support/history?ticketId=${ticketId}`
  );
  const data = await response.json();
  console.log('Conversation history:', data.history);
  return data;
}

// Selesaikan ticket
async function resolveTicket(ticketId) {
  const response = await fetch('http://localhost:3000/api/support/resolve', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ticketId,
      resolution: 'Issue resolved successfully'
    })
  });

  const data = await response.json();
  console.log('Resolution result:', data);
  return data;
}
```

## 7. Contoh dengan Python

```python
import requests
import json

BASE_URL = 'http://localhost:3000'

# Kirim query
def send_query(name, email, query, conversation_id=None):
    payload = {
        'customerName': name,
        'email': email,
        'query': query
    }
    if conversation_id:
        payload['conversationId'] = conversation_id
    
    response = requests.post(
        f'{BASE_URL}/api/support/query',
        json=payload
    )
    return response.json()

# Contoh penggunaan
result = send_query(
    'Ahmad Rizki',
    'ahmad@example.com',
    'Bagaimana cara upgrade ke premium?'
)
print(json.dumps(result, indent=2))
```
