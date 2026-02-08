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
    // Prendiamo l'ID e rimuoviamo eventuali spazi bianchi extra
    const rawId = req.query.id ? req.query.id.trim() : "";

    // LOGICA: 
    // 1. Verifichiamo che l'ID non sia vuoto
    // 2. Verifichiamo che non sia una variabile non espansa di StreamElements
    // 3. Verifichiamo se l'ID esiste come chiave nel file JSON
    console.log(`id passato in input ${rawId}`);
    if (rawId !== "" && rawId !== "$(1)" && rawId !== "$(query)" && pokebressData.hasOwnProperty(rawId)) {
        const pokemonName = pokebressData[rawId];
        return res.send(`il pokemon n° ${rawId} è ${pokemonName}`);
    }

    // FALLBACK: Se non trova l'ID o l'input è nullo/testuale, scatta il Random
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomPokemon = pokebressData[randomKey];
    
    res.send(`oggi sei ${randomPokemon}, il pokemon n° ${randomKey}`);
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server attivo sulla porta ${port}`);
});

