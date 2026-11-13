
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models/load');
const enchantmentRoutes = require('./routes/enchantments');
const enchantmentConflictRoutes = require('./routes/conflicts');

const app = express();
const PORT = process.env.PORT || 3000;


const allowedOrigins = [
  'https://litness.netlify.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'Enchantment API attiva!' }));

app.use('/api/enchantments', enchantmentRoutes);
app.use('/api/conflicts', enchantmentConflictRoutes);

const startServer = async () => {
    await sequelize.authenticate();
    console.log('Connessione al database MySQL riuscita.');

    app.listen(PORT, () => console.log(`Server avviato sulla porta ${PORT}`));
};

startServer().catch(error => {
    console.error('Errore nell\'avvio del server:', error);
    process.exit(1);
});
