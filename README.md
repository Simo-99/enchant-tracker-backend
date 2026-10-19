# Enchantment API

API REST in Node.js, Express, Sequelize e MySQL per consultare il catalogo degli incantesimi Minecraft e aggiornare il campo `found`.

## Requisiti

- Node.js (versione LTS consigliata)
- MySQL
- Le tabelle `enchantments` e `enchantment_conflicts` già create nel database

L'applicazione **non** esegue `sequelize.sync()` e non modifica la struttura del database.

## Installazione

1. Apri un terminale in questa cartella.
2. Installa le dipendenze:

   ```bash
   npm install
   ```

3. Copia `.env.example` in `.env`.
4. Modifica `.env` con le credenziali e il nome del database.
5. Avvia in sviluppo:

   ```bash
   npm run dev
   ```

   Oppure avvia normalmente:

   ```bash
   npm start
   ```

Il server usa la porta `3000` per impostazione predefinita.

## Endpoint

### Elenco e filtri

`GET /api/enchantments`

Filtri combinabili:

- `type`: uno fra `sword`, `axe`, `pickaxe`, `shovel`, `hoe`, `helmet`, `chestplate`, `leggings`, `boots`, `bow`, `crossbow`, `trident`, `mace`, `shield`, `fishing_rod`, `elytra`
- `source`: `vanilla` oppure `custom`
- `found`: `true` oppure `false`

Esempio: `GET /api/enchantments?type=sword&found=true`

### Dettaglio

`GET /api/enchantments/:id`

Restituisce un incantesimo e le incompatibilità registrate per quell'incantesimo.

### Aggiornamento di `found`

`PATCH /api/enchantments/:id/found`

Header: `Content-Type: application/json`

Corpo:

```json
{
  "found": true
}
```

Per togliere il contrassegno, invia `false`.

## Esempi di test

- `GET http://localhost:3000/`
- `GET http://localhost:3000/api/enchantments`
- `GET http://localhost:3000/api/enchantments?type=sword`
- `GET http://localhost:3000/api/enchantments?source=custom&found=false`
- `GET http://localhost:3000/api/enchantments/1`

Per testare il `PATCH`, usa Postman, Insomnia o un client HTTP.

## Nota sulla sicurezza

L'endpoint `PATCH` non richiede autenticazione: chiunque possa raggiungere il server può cambiare `found`. Il codice consente di aggiornare esclusivamente quel campo tramite questo endpoint, ma non sostituisce l'autenticazione. Se il server è accessibile pubblicamente, aggiungi una protezione prima di metterlo online.

## Struttura

```text
enchantment-api/
├── app.js
├── config/
│   └── database.js
├── models/
│   ├── Enchantment.js
│   ├── EnchantmentConflict.js
│   └── associations.js
├── routes/
│   └── enchantments.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```
