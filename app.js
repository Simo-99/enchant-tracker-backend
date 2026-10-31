require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
require('./models/associations');

const app = express();

// Configurazione CORS avanzata e sicura per Netlify e sviluppo locale
const allowedOrigins = [
    process.env.FRONTEND_URL,          // Es. configurabile su Render
    'https://litness.netlify.app',     // Il tuo dominio Netlify attuale
    'http://localhost:5173',           // Vite dev server locale
    'http://localhost:3000'
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Permette richieste senza origin (es. Postman, cURL o app mobile)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('Bloccato da policy CORS: Origine non consentita'));
        }
    },
    credentials: true
}));

app.use(express.json());

// Supporto per X-HTTP-Method-Override header (per client che non supportano PATCH nativamente)

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
            console.log(`Server attivo sulla porta ${PORT}`);
        });
    } catch (error) {
        console.error('Errore di connessione al database:', error.message);
        process.exit(1);
    }
}

startServer();