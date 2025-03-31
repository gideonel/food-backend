import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
connectDB();

const app = express();
const server = createServer(app); // Create an HTTP server
const allowedOrigins = [
  "http://localhost:3000",
  "https://food-frontend-tau.vercel.app"
];

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
  }
});

app.use(express.json());

// CORS configuration for Express
app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Manually define __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static images
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/user', userRoutes);

app.get("/test", (req, res) => {
  res.send("Server is up and running!");
});

// Socket.io Real-time Chat Logic
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("send-message", (msg) => {
    try {
      io.emit("receive-message", { text: msg, sender: "User" });
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import { createServer } from 'http';
// import { Server } from 'socket.io';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import connectDB from './config/db.js';
// import authRoutes from './routes/authRoutes.js';
// import recipeRoutes from './routes/recipeRoutes.js';
// import restaurantRoutes from './routes/restaurantRoutes.js';
// import userRoutes from './routes/userRoutes.js';

// dotenv.config();
// connectDB();

// const app = express();
// const server = createServer(app); // Create an HTTP server
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000", // Allow frontend
//     methods: ["GET", "POST"],
//   }
// });

// app.use(express.json());
// app.use(cors({ 
//     origin: "http://localhost:3000",
//     credentials: true 
    
// }));

// // Manually define __dirname in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Serve static images
// app.use('/images', express.static(path.join(__dirname, 'public/images')));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/recipes', recipeRoutes);
// app.use('/api/restaurants', restaurantRoutes);
// app.use('/api/user', userRoutes);

// app.get("/test", (req, res) => {
//   res.send("Server is up and running!");
// });

// // 🔥 Socket.io Real-time Chat Logic
// io.on('connection', (socket) => {
//   console.log(`🟢 New client connected: ${socket.id}`);

//   socket.on("send-message", (msg) => {
//   // Emit message with sender info
//   io.emit("receive-message", { text: msg, sender: "User" });
// });

//   socket.on('disconnect', () => {
//     console.log(`🔴 Client disconnected: ${socket.id}`);
//   });
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
