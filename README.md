# Enchantment API

API REST in Node.js, Express, Sequelize e MySQL per consultare il catalogo degli incantesimi Minecraft e aggiornare il campo `found`.

## Struttura del progetto

```text
enchantment-api/
├── config/
│   └── database.js
├── models/
│   ├── Enchantment.js
│   ├── EnchantmentConflict.js
│   └── load.js
├── controllers/
│   ├── enchantmentController.js
│   └── enchantmentConflictController.js
├── routes/
│   ├── enchantments.js
│   └── enchantmentConflicts.js
├── index.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Installazione

1. Installa le dipendenze:
   ```bash
   npm install
   ```
2. Copia `.env.example` in `.env` e configura i parametri del database.
3. Avvia il server:
   ```bash
   npm start
   ```
   Oppure in modalità sviluppo:
   ```bash
   npm run dev
   ```
