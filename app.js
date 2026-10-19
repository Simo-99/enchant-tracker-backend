require('dotenv').config();

const express = require('express');
const cors = require('cors'); // <-- 1. Importa il pacchetto cors
const sequelize = require('./config/database');
require('./models/associations');

const app = express();

// <-- 2. Abilita CORS per permettere al frontend (es. localhost:5173) di comunicare
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'API Enchantments attiva' });
});

app.use('/api/enchantments', require('./routes/enchantments'));

app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint non trovato' });
});

const PORT = Number(process.env.PORT || 3000);

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Connessione al database riuscita');

        app.listen(PORT, () => {
            console.log(`Server attivo su http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Errore di connessione al database:', error.message);
        process.exit(1);
    }
}

startServer();