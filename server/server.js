// ─────────────────────────────────────────────
// WebSocket Server for Security System
// Handles real-time "new_match" events from Raspberry Pi
// and broadcasts to all connected web clients
// ─────────────────────────────────────────────

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

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

// In-memory storage for confirmed/rejected detections
let detections = [];

// JSON file storage
const DATA_FILE = path.join(__dirname, 'security_data.json');

// Initialize JSON file if it doesn't exist
function initializeDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
}

// Read data from JSON file
function readDataFromFile() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    return [];
  }
}

// Save data to JSON file
function saveDataToFile(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving data file:', error);
    return false;
  }
}

// Initialize data file on startup
initializeDataFile();

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  connectedClients.add(socket.id);

  // Send welcome message to new client
  socket.emit('connected', {
    message: 'Connected to Security System WebSocket Server',
    timestamp: new Date().toISOString()
  });

  // Handle "new_match" events from Raspberry Pi or any client
  socket.on('new_match', (data) => {
    console.log('Received new_match event:', data);
    
    // Validate required fields
    const requiredFields = ['person_name', 'person_id', 'age', 'legal_case', 'score', 'node_id', 'timestamp'];
    const isValid = requiredFields.every(field => data.hasOwnProperty(field));
    
    if (isValid) {
      // Add server metadata
      const enrichedData = {
        ...data,
        server_timestamp: new Date().toISOString(),
        match_id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      
      // Save to JSON file
      const currentData = readDataFromFile();
      currentData.unshift(enrichedData); // Add to beginning (latest first)
      
      // Keep only last 1000 records to prevent file from growing too large
      if (currentData.length > 1000) {
        currentData.splice(1000);
      }
      
      saveDataToFile(currentData);
      
      // Broadcast to all connected clients (including sender)
      io.emit('new_match', enrichedData);
      
      console.log(`Broadcasted match to ${connectedClients.size} clients and saved to file`);
    } else {
      console.error('Invalid match data format:', data);
      socket.emit('error', {
        message: 'Invalid data format. Required fields: person_name, person_id, age, legal_case, score, node_id, timestamp',
        received_data: data
      });
    }
  });

  // Handle "criminal_confirmed" events from frontend
  socket.on('criminal_confirmed', (data) => {
    console.log('Received criminal_confirmed event:', data);
    
    // Store in memory with status
    const detectionRecord = {
      name: data.name,
      id: data.id,
      time: data.time,
      location: data.location,
      status: 'confirmed',
      server_timestamp: new Date().toISOString()
    };
    
    detections.push(detectionRecord);
    
    console.log('Stored confirmed detection:', detectionRecord);
    console.log(`Total detections stored: ${detections.length}`);
    
    // Acknowledge receipt
    socket.emit('criminal_confirmed_ack', {
      success: true,
      message: 'Criminal detection confirmed and stored'
    });
  });

  // Handle "criminal_rejected" events from frontend
  socket.on('criminal_rejected', (data) => {
    console.log('Received criminal_rejected event:', data);
    
    // Store in memory with status
    const detectionRecord = {
      name: data.name,
      id: data.id,
      time: data.time,
      location: data.location,
      status: 'rejected',
      server_timestamp: new Date().toISOString()
    };
    
    detections.push(detectionRecord);
    
    console.log('Stored rejected detection:', detectionRecord);
    console.log(`Total detections stored: ${detections.length}`);
    
    // Acknowledge receipt
    socket.emit('criminal_rejected_ack', {
      success: true,
      message: 'Criminal detection rejected and stored'
    });
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
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
  
  // Validate required fields
  const requiredFields = ['person_name', 'person_id', 'age', 'legal_case', 'score', 'node_id', 'timestamp'];
  const isValid = requiredFields.every(field => matchData.hasOwnProperty(field));
  
  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: 'Invalid data format. Required fields: person_name, person_id, age, legal_case, score, node_id, timestamp'
    });
  }
  
  // Add server metadata
  const enrichedData = {
    ...matchData,
    server_timestamp: new Date().toISOString(),
    match_id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
  
  // Save to JSON file
  const currentData = readDataFromFile();
  currentData.unshift(enrichedData);
  
  // Keep only last 1000 records
  if (currentData.length > 1000) {
    currentData.splice(1000);
  }
  
  saveDataToFile(currentData);
  
  // Broadcast to all WebSocket clients
  io.emit('new_match', enrichedData);
  
  console.log('Received match via REST API:', matchData);
  res.json({ 
    success: true, 
    message: 'Match saved and broadcasted to all clients',
    match_id: enrichedData.match_id 
  });
});

// REST endpoint to read saved data (fallback for frontend)
app.get('/api/data', (req, res) => {
  try {
    const data = readDataFromFile();
    res.json({
      success: true,
      data: data,
      count: data.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({
      success: false,
      message: 'Error reading data file'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  const data = readDataFromFile();
  res.json({
    status: 'healthy',
    connected_clients: connectedClients.size,
    saved_records: data.length,
    detections_count: detections.length,
    timestamp: new Date().toISOString()
  });
});

// API endpoint to get all detections (confirmed/rejected)
app.get('/api/detections', (req, res) => {
  res.json({
    success: true,
    detections: detections,
    count: detections.length,
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
  console.log(`🔍 Detections API: http://192.168.2.8:${PORT}/api/detections`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔄 Shutting down server gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
