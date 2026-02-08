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
    console.log(`[STARTUP] Server pronto. Range: ${minId}-${maxId}`);
} catch (err) {
    console.error("[ERROR] Caricamento JSON fallito:", err);
}

app.get('/pokebress', (req, res) => {
    // Prendiamo l'input da ?id=...
    let rawId = req.query.id ? req.query.id.trim() : "";
    console.log(`[LOG] Chiamata ricevuta. Input: "${rawId}"`);

    let idFinale = "";

    // Se l'input contiene la variabile non compilata o la nostra q di sicurezza
    if (rawId.includes("$") || rawId === "q" || !rawId) {
        idFinale = "q"; 
        console.log(`[LOGIC] Caso Random (variabile o vuoto).`);
    } 
    // Se c'è un numero, puliamo tutto il resto
    else if (/\d/.test(rawId)) { 
        idFinale = rawId.replace(/\D/g, ''); 
        console.log(`[LOGIC] Numero rilevato: ${idFinale}`);
    }

    const idNumerico = parseInt(idFinale);

    if (!idFinale || isNaN(idNumerico) || idNumerico < minId || idNumerico > maxId || !pokemonData[idFinale]) {
        const randomKey = keysArray[Math.floor(Math.random() * keysArray.length)];
        const randomPokemon = pokemonData[randomKey];
        return res.send(`oggi sei ${randomPokemon}, il pokemon n° ${randomKey}`);
    }

    const nome = pokemonData[idFinale];
    res.send(`Il Pokémon n°${idFinale} è ${nome}!`);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SERVER] In ascolto sulla porta ${PORT}`);
});
