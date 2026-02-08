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
    console.log(`[STARTUP] Dati caricati. Range: ${minId}-${maxId}`);
} catch (err) {
    console.error("[ERROR] Fallimento caricamento JSON:", err);
}

app.get('/pokebress/:id?', (req, res) => {
    let idRaw = req.params.id ? req.params.id.trim() : "";
    console.log(`[REQUEST] Raw ricevuto: "${idRaw}"`);

    let idFinale = "";

    // LOGICA RICHIESTA:
    // Se l'input è ESATTAMENTE "q", lo teniamo così com'è (andrà in random dopo)
    if (idRaw === "q") {
        idFinale = "q";
        console.log(`[LOGIC] Rilevata 'q' singola. Nessun trim.`);
    } else {
        // Altrimenti, trimmiamo via tutto quello che non è un numero
        idFinale = idRaw.replace(/\D/g, '');
        console.log(`[LOGIC] Input misto o numerico. Risultato pulito: "${idFinale}"`);
    }

    const idNumerico = parseInt(idFinale);

    // CONTROLLO PER RISPOSTA
    // Se non è un numero (quindi è "q" o vuoto) o fuori range o non esiste
    if (!idFinale || isNaN(idNumerico) || idNumerico < minId || idNumerico > maxId || !pokemonData[idFinale]) {
        const randomKey = keysArray[Math.floor(Math.random() * keysArray.length)];
        const randomPokemon = pokemonData[randomKey];
        
        console.log(`[RESPONSE] RANDOM -> Mandato ${randomKey}`);
        return res.send(`oggi sei ${randomPokemon}, il pokemon n° ${randomKey}`);
    }

    // RISPOSTA SPECIFICA
    const nome = pokemonData[idFinale];
    console.log(`[RESPONSE] SPECIFICO -> ID ${idFinale}: ${nome}`);
    res.send(`bre90sHype bre90sHype Il Pokémon n°${idFinale} è ${nome}! bre90sHype bre90sHype`);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SERVER] In ascolto sulla porta ${PORT}`);
});
