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

    // LOGICA: Se l'ID è valido e presente nel JSON
    if (inputId && inputId !== "$(1)" && inputId !== "$(query)" && pokebressData[inputId]) {
        const pokemonName = pokebressData[inputId];
        // Restituisce solo la parte finale della frase
        return res.send(`il pokemon n° ${inputId} è ${pokemonName}`);
    }

    // FALLBACK: Caso Random
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomPokemon = pokebressData[randomKey];
    
    // Restituisce solo la frase randomica pura
    res.send(`oggi sei ${randomPokemon}, il pokemon n° ${randomKey}`);
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server attivo sulla porta ${port}`);
});
