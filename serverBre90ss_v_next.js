const express = require('express');
const cors = require('cors'); // Importante per non avere blocchi dal browser
const fs = require('fs');
const app = express();

// Abilitiamo CORS per permettere al frontend di comunicare con Render
app.use(cors());

// Porta dinamica per Render (fondamentale!)
const PORT = process.env.PORT || 3000;

// Carichiamo il dizionario all'avvio
let pokemonData = {};
try {
    const data = fs.readFileSync('pokebress.json', 'utf8');
    pokemonData = JSON.parse(data);
} catch (err) {
    console.error("Errore nel caricamento del file JSON:", err);
}

app.get('/pokedex/:id', (req, res) => {
    const id = req.params.id;
    const idNumerico = parseInt(id);

    // 1. Controllo se l'ID è un numero e se rientra nel range 0-151
    if (isNaN(idNumerico) || idNumerico < 0 || idNumerico > 151) {
        return res.status(400).send("Errore: Inserisci un ID valido tra 0 e 151.");
    }

    // 2. Controllo se il Pokémon esiste effettivamente nel tuo file JSON
    const nome = pokemonData[id];

    if (nome) {
        res.send(nome);
    } else {
        // Se l'ID è nel range ma non c'è nel JSON
        res.status(404).send(`Pokémon con ID ${id} non trovato nel database.`);
    }
});

// Avvio del server
app.listen(PORT, () => {
    console.log(`Server Pokédex in esecuzione sulla porta ${PORT}`);
    console.log(`Range accettato: 0 - 151`);
});