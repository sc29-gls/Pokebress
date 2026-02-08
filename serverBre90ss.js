const express = require('express');
const cors = require('cors'); 
const fs = require('fs');
const app = express();

app.use(cors());
const PORT = process.env.PORT || 3000;

let pokemonData = {};
let keysArray = [];
let maxId = 0, minId = 0;

// Caricamento dati
try {
    const data = fs.readFileSync('pokebress.json', 'utf8');
    pokemonData = JSON.parse(data);
    const numericKeys = Object.keys(pokemonData).map(Number);
    keysArray = Object.keys(pokemonData);
    maxId = Math.max(...numericKeys);
    minId = Math.min(...numericKeys);
    console.log(`[STARTUP] Dati caricati. Range: ${minId}-${maxId}`);
} catch (err) {
    console.error("[ERROR] Fallimento caricamento JSON:", err);
}

// Rotta flessibile
app.get('/pokebress/:id?', (req, res) => {
    let rawId = req.params.id ? req.params.id.trim() : "";
    console.log(`[LOG] Input ricevuto: "${rawId}"`);

    let idFinale = "";

    // 1. Se passa ${1}q o variabile non compilata, deve rimanere solo q
    if (rawId.includes("$") || rawId === "q") {
        idFinale = "q"; 
        console.log(`[LOGIC] Variabile bot o 'q' rilevata. Id finale: "q"`);
    } 
    // 2. Se c'è un numero (es. 45q), teniamo solo il numero
    else if (/\d/.test(rawId)) { 
        idFinale = rawId.replace(/\D/g, ''); 
        console.log(`[LOGIC] Numero rilevato. Pulito in: "${idFinale}"`);
    } 
    // 3. Fallback
    else {
        idFinale = rawId || "q";
    }

    const idNumerico = parseInt(idFinale);

    // LOGICA RANDOM (se non è un numero, fuori range o non esiste)
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
