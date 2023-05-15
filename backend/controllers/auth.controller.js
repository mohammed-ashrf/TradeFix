const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const config = require('../config');

exports.register = async function (req, res) {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ username, email, password: hashedPassword, role });
    const savedUser = await user.save();

    const token = jwt.sign({ id: savedUser._id }, config.jwtSecret, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    console.error('Failed to register user:', error.message);
    res.status(500).json({ message: 'Failed to register user' });
  }
};

exports.login = async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (!password) {
      return res.status(400).json({ message: 'password is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('Failed to login user:', error.message);
    res.status(500).json({ message: 'Failed to login user' });
  }
};

exports.getUsers = async function(req, res) { 
  try { 
    const users = await User.find(); 
    res.status(200).json(users); 
  } catch (error) { 
    console.error('Failed to get users:', error.message); 
    res.status(500).json({ message: 'Failed to get users' }); 
  }
}

exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

exports.checkToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

exports.getUserById = async function(req, res) { 
  try { 
    const user = await User.findById(req.params.id); 
    res.status(200).json(user); 
  } catch (error) { 
    console.error('Failed to get user by ID:', error.message); 
    res.status(500).json({ message: 'Failed to get user by ID' }); 
  }
};
