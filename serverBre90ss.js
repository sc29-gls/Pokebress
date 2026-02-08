const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Caricamento database Pokémon
let pokebressData = {};
try {
    // Assicurati che il file pokebress.json sia nella stessa cartella
    pokebressData = JSON.parse(fs.readFileSync('pokebress.json', 'utf8'));
} catch (err) {
    console.error("Errore lettura JSON:", err);
}

const keys = Object.keys(pokebressData);

app.get('/pokebress', (req, res) => {
    const inputId = req.query.id;

    // LOGICA: Se l'ID è valido e presente nel JSON
    if (inputId && inputId !== "$(1)" && inputId !== "$(query)" && pokebressData[inputId]) {
        const pokemonName = pokebressData[inputId];
        console.log(`ID valido ${inputId} -> ${pokemonName}`}
        return res.send(`il pokemon n° ${inputId} è ${pokemonName}`);
    }

    // FALLBACK: Caso Random
    if (keys.length > 0) {
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const randomPokemon = pokebressData[randomKey];
        console.log(`ID ricevuto ${inputId}`}
        console.log(`ID random ${randomKey} -> ${randomPokemon}`}
        res.send(`oggi sei ${randomPokemon}, il pokemon n° ${randomKey}`);
    } else {
        res.status(500).send("Database Pokémon vuoto o non caricato.");
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server attivo sulla porta ${port}`);
});
