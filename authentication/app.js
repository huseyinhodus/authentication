const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); 

const app = express();
const port = 3000;
const secretKey = 'yourSecretKey'; 

// MongoDB Atlas bağlantı dizesi
const mongoURI =
  'mongodb+srv://dijitalfikirtodo:123qwe123@dbcluster1.klchy1y.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Kullanıcı modeli
const User = mongoose.model('User', {
  email: String,
  password: String,
});

app.use(bodyParser.urlencoded({ extended: true }));

// Function to generate a JWT token
function generateToken(user) {
  return jwt.sign({ userId: user._id, email: user.email }, secretKey, { expiresIn: '1h' });
}

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Kullanıcıyı MongoDB'den sorgula
  const user = await User.findOne({ email, password });

  if (user) {
    // Generate and send a JWT token upon successful login
    const token = generateToken(user);
    res.json({ token });
  } else {
    res.status(401).send('E-posta veya şifre hatalı.');
  }
});

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(403).send('Yetkisiz erişim');
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send('Geçersiz token');
    }
    req.user = decoded;
    next();
  });
}

// Example protected route
app.get('/protected', verifyToken, (req, res) => {
  res.send(`Hoş geldiniz, ${req.user.email}!`);
});

app.listen(port, () => {
  console.log(`Çalışıyor`);
});
