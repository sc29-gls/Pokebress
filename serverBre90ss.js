const express = require('express');
const cors = require('cors'); 
const fs = require('fs');
const app = express();

app.use(cors());
const PORT = process.env.PORT || 3000;

let pokemonData = {};
let keysArray = [];
let maxId = 0;
let minId = 0;

// Caricamento dati
try {
    const data = fs.readFileSync('pokebress.json', 'utf8');
    pokemonData = JSON.parse(data);
    const numericKeys = Object.keys(pokemonData).map(Number);
    keysArray = Object.keys(pokemonData);
    maxId = Math.max(...numericKeys);
    minId = Math.min(...numericKeys);
    console.log(`[STARTUP] Pronto. Range: ${minId}-${maxId}`);
} catch (err) {
    console.error("[ERROR] JSON non caricato:", err);
}

// Rotta unica
app.get('/pokebress', (req, res) => {
    let rawId = req.query.id ? req.query.id.trim() : "";
    console.log(`[LOG] Input: "${rawId}"`);

    let idFinale = "";

    // Se l'input contiene simboli del bot o è la nostra q di sicurezza
    if (rawId.includes("$") || rawId.includes("{") || rawId === "q" || !rawId) {
        idFinale = "q";
    } 
    // Se c'è un numero nel fritto misto (es. "45q")
    else if (/\d/.test(rawId)) { 
        idFinale = rawId.replace(/\D/g, ''); 
    } 
    else {
        idFinale = "q";
    }

    const idNumerico = parseInt(idFinale);

    // Risposta: Se non è un numero valido nel range, vai di Random
    if (!idFinale || isNaN(idNumerico) || idNumerico < minId || idNumerico > maxId || !pokemonData[idFinale]) {
        const randomKey = keysArray[Math.floor(Math.random() * keysArray.length)];
        const randomPokemon = pokemonData[randomKey];
        console.log(`[RANDOM] -> ${randomKey}`);
        return res.send(`oggi sei ${randomPokemon}, il pokemon n° ${randomKey}`);
    }

    // Altrimenti manda quello specifico
    const nome = pokemonData[idFinale];
    console.log(`[SPECIFICO] -> ${idFinale}`);
    res.send(`Il Pokémon n°${idFinale} è ${nome}!`);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SERVER] Online sulla porta ${PORT}`);
});
