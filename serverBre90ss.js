const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Caricamento database Pokémon
let pokebressData = {};
try {
    pokebressData = JSON.parse(fs.readFileSync('pokebress.json', 'utf8'));
} catch (err) {
    console.error("Errore lettura JSON:", err);
}

const keys = Object.keys(pokebressData);

app.get('/pokebress', (req, res) => {
    let inputId = req.query.id;

    // 1. PULIZIA DELL'INPUT
    // Se l'input contiene "!p", lo rimuoviamo e prendiamo solo quello che resta (trim elimina gli spazi)
    if (inputId) {
        inputId = inputId.replace('!p', '').trim();
    }

    // 2. LOGICA DI RICERCA (Se l'ID pulito esiste nel database)
    if (inputId && pokebressData[inputId]) {
        const pokemonName = pokebressData[inputId];
        console.log(`ID richiesto: ${inputId} -> ${pokemonName}`);
        return res.send(`il pokemon n° ${inputId} è ${pokemonName}`);
    }

    // 3. LOGICA RANDOM (Fallback se l'input è vuoto, è solo "!p" o l'ID non esiste)
    if (keys.length > 0) {
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const randomPokemon = pokebressData[randomKey];
        console.log(`Input non valido "${inputId}" || ID randomizzato: (${randomKey}) -> ${randomPokemon}`);
        return res.send(`oggi sei ${randomPokemon}, il pokemon n° ${randomKey}`);
    } else {
        return res.status(500).send("Errore: Database Pokémon non caricato correttamente.");
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});



