require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.json());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cookieParser());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// User Schema & Model
const UserSchema = new mongoose.Schema({ 
  name: String, 
  email: String, 
  password: String, 
  isActive: { type: Boolean, default: true }
});
const User = mongoose.model('User', UserSchema);

// Recipe Schema & Model
const RecipeSchema = new mongoose.Schema({
  name: String,
  calories: Number,
  costNaira: Number
});
const Recipe = mongoose.model('Recipe', RecipeSchema);

// Restaurant Schema & Model
const RestaurantSchema = new mongoose.Schema({
  name: String,
  location: String
});
const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

// JWT Authentication Middleware
const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// Register User
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  res.json({ message: 'User registered successfully' });
});

// Login User
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true }).json({ message: 'Login successful' });
});

// Logout User
app.post('/logout', (req, res) => {
  res.clearCookie('token').json({ message: 'Logged out' });
});

// Get Profile
app.get('/profile', authenticateUser, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});

// Fetch Recipes
app.get('/recipes', authenticateUser, async (req, res) => {
  const recipes = await Recipe.find();
  res.json(recipes);
});

// Currency Converter (NGN to USD)
app.get('/convert/:amount', async (req, res) => {
  const amount = req.params.amount;
  const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/NGN`);
  const rate = response.data.rates.USD;
  res.json({ usd: (amount * rate).toFixed(2) });
});

// Real-time Chat
io.on('connection', (socket) => {
  console.log('User connected');
  socket.on('message', (msg) => io.emit('message', msg));
  socket.on('disconnect', () => console.log('User disconnected'));
});

server.listen(5000, () => console.log('Server running on port 5000'));
