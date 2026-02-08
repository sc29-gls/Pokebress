const express = require('express');
const cors = require('cors'); 
const fs = require('fs');
const app = express();

app.use(cors());
const PORT = process.env.PORT || 3000;

let pokemonData = {};
let keysArray = [];
let maxId = 0, minId = 0;

// Caricamento dati all'avvio
try {
    const data = fs.readFileSync('pokebress.json', 'utf8');
    pokemonData = JSON.parse(data);
    const numericKeys = Object.keys(pokemonData).map(Number);
    keysArray = Object.keys(pokemonData);
    maxId = Math.max(...numericKeys);
    minId = Math.min(...numericKeys);
    console.log(`[STARTUP] Range: ${minId}-${maxId}`);
} catch (err) {
    console.error("[ERROR] Fallimento caricamento JSON:", err);
}

app.get('/pokebress/:id?', (req, res) => {
    let rawId = req.params.id ? req.params.id.trim() : "";
    console.log(`[LOG] Input ricevuto: "${rawId}"`);

    let idFinale = "";

    // LOGICA RICHIESTA: Se passa ${1}q deve rimanere solo q
    if (rawId.includes("$(1)") || rawId.includes("$(query)")) {
        idFinale = "q"; 
        console.log(`[LOGIC] Variabile bot rilevata. Forzo id a: "q"`);
    } 
    // Se c'è un numero (es. 45q), teniamo solo il numero
    else if (/\d/.test(rawId)) { 
        idFinale = rawId.replace(/\D/g, ''); 
        console.log(`[LOGIC] Numero rilevato. Pulito in: "${idFinale}"`);
    } 
    // Altrimenti (es. q singola o altro)
    else {
        idFinale = rawId;
        console.log(`[LOGIC] Nessun numero trovato. Mantengo: "${idFinale}"`);
    }

    const idNumerico = parseInt(idFinale);

    // LOGICA RANDOM (se non è un numero, fuori range o non esiste nel JSON)
    if (!idFinale || isNaN(idNumerico) || idNumerico < minId || idNumerico > maxId || !pokemonData[idFinale]) {
        const randomKey = keysArray[Math.floor(Math.random() * keysArray.length)];
        const randomPokemon = pokemonData[randomKey];
        
        console.log(`[RESPONSE] RANDOM -> ${randomKey}`);
        return res.send(`oggi sei ${randomPokemon}, il pokemon n° ${randomKey}`);
    }

    // RISPOSTA SPECIFICA
    const nome = pokemonData[idFinale];
    console.log(`[RESPONSE] SPECIFICO -> ${idFinale}: ${nome}`);
    res.send(`bre90sHype bre90sHype Il Pokémon n°${idFinale} è ${nome}! bre90sHype bre90sHype`);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SERVER] In ascolto sulla porta ${PORT}`);
});
