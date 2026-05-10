// ─────────────────────────────────────────────
// WebSocket Server for Security System
// Handles real-time "new_match" events from Raspberry Pi
// and broadcasts to all connected web clients
// ─────────────────────────────────────────────

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      "https://spireless-elmira-unmurmurably.ngrok-free.dev",
      "http://localhost:3000",
      "http://localhost:3001",
      "https://*.vercel.app",
      "https://vercel.app"
    ],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: [
    "https://spireless-elmira-unmurmurably.ngrok-free.dev",
    "http://localhost:3000",
    "http://localhost:3001",
    "https://*.vercel.app",
    "https://vercel.app"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true
}));
app.use(express.json());

// Store connected clients
let connectedClients = new Set();

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  console.log(`📊 Total connected clients: ${connectedClients.size + 1}`);
  console.log(`🌐 Client origin: ${socket.handshake.headers.origin}`);
  console.log(`🔍 Client IP: ${socket.handshake.address}`);
  
  connectedClients.add(socket.id);

  // Send welcome message to new client
  socket.emit('connected', {
    message: 'Connected to Security System WebSocket Server',
    timestamp: new Date().toISOString(),
    client_id: socket.id,
    server_status: 'healthy'
  });
  
  console.log(`📨 Sent welcome message to client: ${socket.id}`);

  // Handle "new_match" events from Raspberry Pi or any client
  socket.on('new_match', (data) => {
    console.log('📨 Received new_match event from client:', socket.id);
    console.log('🔍 Event data:', JSON.stringify(data, null, 2));
    
    // Validate required fields
    const requiredFields = ['person_name', 'person_id', 'age', 'legal_case', 'score', 'node_id', 'timestamp'];
    const isValid = requiredFields.every(field => data.hasOwnProperty(field));
    
    console.log('✅ Data validation:', isValid ? 'PASSED' : 'FAILED');
    
    if (isValid) {
      // Broadcast to all connected clients (including sender)
      const broadcastData = {
        ...data,
        server_timestamp: new Date().toISOString(),
        match_id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      
      io.emit('new_match', broadcastData);
      
      console.log(`📡 Broadcasted match to ${connectedClients.size} clients`);
      console.log('🔗 Match ID:', broadcastData.match_id);
    } else {
      console.error('❌ Invalid match data format:', data);
      console.error('📋 Missing fields:', requiredFields.filter(field => !data.hasOwnProperty(field)));
      
      socket.emit('error', {
        message: 'Invalid data format. Required fields: person_name, person_id, age, legal_case, score, node_id, timestamp',
        received_data: data,
        missing_fields: requiredFields.filter(field => !data.hasOwnProperty(field))
      });
    }
  });

  // Handle client disconnection
  socket.on('disconnect', (reason) => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
    console.log(`📊 Disconnect reason: ${reason}`);
    console.log(`📈 Remaining connected clients: ${connectedClients.size - 1}`);
    connectedClients.delete(socket.id);
  });

  // Handle ping for connection health
  socket.on('ping', () => {
    socket.emit('pong', { timestamp: new Date().toISOString() });
  });
});

// REST API endpoint for testing (optional)
app.post('/api/new_match', (req, res) => {
  const matchData = req.body;
  
  // Broadcast to all WebSocket clients
  io.emit('new_match', {
    ...matchData,
    server_timestamp: new Date().toISOString(),
    match_id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  });
  
  console.log('Received match via REST API:', matchData);
  res.json({ 
    success: true, 
    message: 'Match broadcasted to all clients',
    match_id: matchData.match_id 
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    connected_clients: connectedClients.size,
    timestamp: new Date().toISOString()
  });
});

// API endpoint to get all matches (for fallback)
app.get('/api/data', (req, res) => {
  console.log('📊 Request for data via REST API');
  res.json({
    success: true,
    data: [], // In-memory storage would go here
    count: 0,
    timestamp: new Date().toISOString()
  });
});

// Start server on port 8080 to match ngrok configuration
const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Security System WebSocket Server running on port ${PORT}`);
  console.log(`📡 WebSocket endpoint: ws://192.168.2.8:${PORT}`);
  console.log(`🌐 Health check: http://192.168.2.8:${PORT}/health`);
  console.log(`📝 REST API: http://192.168.2.8:${PORT}/api/new_match`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔄 Shutting down server gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
