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
    const inputId = req.query.id;

    // Verifica se l'ID è fornito e presente nel database
    if (inputId && inputId !== "$(1)" && inputId !== "$(query)" && pokebressData[inputId]) {
        const pokemonName = pokebressData[inputId];
        console.log(`ID richiesto: ${inputId} -> ${pokemonName}`);
        return res.send(`il pokemon n° ${inputId} è ${pokemonName}`);
    }

    // Caso Random (Fallback)
    if (keys.length > 0) {
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const randomPokemon = pokebressData[randomKey];
        console.log(`ID non valido: ${inputId} || ID randomizzato: ${randomPokemon} -> ${randomPokemon}`);
        res.send(`oggi sei ${randomPokemon}, il pokemon n° ${randomKey}`);
    } else {
        res.status(500).send("Errore: Database Pokémon non caricato correttamente.");
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});



