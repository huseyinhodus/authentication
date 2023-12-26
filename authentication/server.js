const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// MongoDB Atlas bağlantı dizesi
const mongoURI = 'mongodb+srv://<kullaniciAdi>:<sifre>@<clusterAdi>/<veritabaniAdi>?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Kullanıcı modeli
const User = mongoose.model('User', {
  email: String,
  password: String,
});

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Kullanıcıyı MongoDB'den sorgula
  const user = await User.findOne({ email, password });

  if (user) {
    res.send('Giriş başarılı!');
  } else {
    res.status(401).send('E-posta veya şifre hatalı.');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
