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
    // Otteniamo tutte le chiavi della query (es. se l'URL è ?45, Object.keys restituirà ["45"])
    const queryKeys = Object.keys(req.query);
    const rawId = queryKeys.length > 0 ? queryKeys[0].trim() : "";

    console.log(`ID ricevuto dalla query: ${rawId}`);

    // LOGICA:
    // 1. Verifichiamo che l'ID non sia vuoto
    // 2. Verifichiamo che non sia il testo letterale della variabile del bot
    // 3. Verifichiamo se l'ID esiste nel JSON
    if (rawId !== "" && 
        rawId !== "$(1)" && 
        rawId !== "$(query)" && 
        pokebressData.hasOwnProperty(rawId)) {
        
        const pokemonName = pokebressData[rawId];
        return res.send(`il pokemon n° ${rawId} è ${pokemonName}`);
    }

    // FALLBACK: Caso Random
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomPokemon = pokebressData[randomKey];
    
    res.send(`oggi sei ${randomPokemon}, il pokemon n° ${randomKey}`);
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server attivo sulla porta ${port}`);
});
