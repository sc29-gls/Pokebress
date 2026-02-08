const express = require('express');
const cors = require('cors'); 
const fs = require('fs');
const app = express();

app.use(cors());
const PORT = process.env.PORT || 3000;

let pokemonData = {};
let keysArray = [];
let maxId = 0, minId = 0;

try {
    const data = fs.readFileSync('pokebress.json', 'utf8');
    pokemonData = JSON.parse(data);
    const numericKeys = Object.keys(pokemonData).map(Number);
    keysArray = Object.keys(pokemonData);
    maxId = Math.max(...numericKeys);
    minId = Math.min(...numericKeys);
    console.log(`[STARTUP] Dati caricati. Range: ${minId}-${maxId}. Totale Pokémon: ${keysArray.length}`);
} catch (err) {
    console.error("[ERROR] Fallimento caricamento JSON:", err);
}

app.get('/pokebress/:id?', (req, res) => {
    // LOG FONDAMENTALE: Vediamo cosa arriva da StreamElements
    console.log(`[REQUEST] URL completo chiamato: ${req.originalUrl}`);
    console.log(`[PARAM] req.params.id grezzo: "${req.params.id}"`);

    let id = req.params.id;

    // Pulizia dell'input
    if (id) {
        id = id.replace('q', '').trim();
    }

    const idNumerico = parseInt(id);

    // LOG LOGICA: Vediamo come viene interpretato l'ID
    console.log(`[PROCESS] ID interpretato: "${id}" | ID Numerico: ${idNumerico}`);

    // LOGICA RANDOM
    if (!id || id === "" || id === "$(1)" || isNaN(idNumerico) || idNumerico < minId || idNumerico > maxId || !pokemonData[id]) {
        const randomKey = keysArray[Math.floor(Math.random() * keysArray.length)];
        const randomPokemon = pokemonData[randomKey];
        
        const respRandom = `oggi sei ${randomPokemon}, il pokemon n° ${randomKey}`;
        console.log(`[RESPONSE] Caso RANDOM -> Inviato: ${respRandom}`);
        return res.send(respRandom);
    }

    // LOGICA SPECIFICA
    const nome = pokemonData[id];
    const respSpecifica = `bre90sHype bre90sHype Il Pokémon n°${id} è ${nome}! bre90sHype bre90sHype`;
    console.log(`[RESPONSE] Caso SPECIFICO -> Inviato: ${respSpecifica}`);
    res.send(respSpecifica);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SERVER] In ascolto sulla porta ${PORT}`);
});

