const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Permet de gérer les requêtes cross-origin
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration de la base de données
const db = mysql.createConnection({
  host: process.env.DB_HOST, // Configuré depuis Render
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) throw err;
  console.log('Connecté à la base de données OVH');
});

// Endpoint pour traiter les requêtes POST
app.post('/submit', (req, res) => {
  const { name, email, subject, message } = req.body;

  const query = 'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)';
  db.query(query, [name, email, subject, message], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erreur lors de l\'enregistrement.');
    } else {
      res.send('Message enregistré avec succès!');
    }
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur backend actif sur le port ${port}`);
});
