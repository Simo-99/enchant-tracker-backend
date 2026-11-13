
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models/load');
const enchantmentRoutes = require('./routes/enchantments');
const enchantmentConflictRoutes = require('./routes/enchantmentConflicts');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'Enchantment API attiva!' }));

app.use('/api/enchantments', enchantmentRoutes);
app.use('/api/enchantment-conflicts', enchantmentConflictRoutes);

const startServer = async () => {
    await sequelize.authenticate();
    console.log('Connessione al database MySQL riuscita.');

    app.listen(PORT, () => console.log(`Server avviato sulla porta ${PORT}`));
};

startServer().catch(error => {
    console.error('Errore nell\'avvio del server:', error);
    process.exit(1);
});
