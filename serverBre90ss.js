const express = require('express');
const cors = require('cors'); 
const fs = require('fs');
const app = express();

app.use(cors());

const PORT = process.env.PORT || 3000;

// Variabili globali
let pokemonData = {};
let keysArray = [];
let maxId = 0;
let minId = 0;

try {
    const data = fs.readFileSync('pokebress.json', 'utf8');
    pokemonData = JSON.parse(data);
    const numericKeys = Object.keys(pokemonData).map(Number);
    keysArray = Object.keys(pokemonData);
    
    maxId = Math.max(...numericKeys);
    minId = Math.min(...numericKeys);
    console.log(`Dati caricati. Range: ${minId} - ${maxId}`);
} catch (err) {
    console.error("Errore caricamento JSON:", err);
}

app.get('/pokebress/:id', (req, res) => {
    const id = req.params.id;
    const idNumerico = parseInt(id);

    // CONTROLLO RIGOROSO:
    // Se l'id non è un numero, o è la variabile $(1) non espansa,
    // o è fuori dal range min/max, o non esiste nel JSON...
    if (isNaN(idNumerico) || id === "$(1)" || idNumerico < minId || idNumerico > maxId || !pokemonData[id]) {
        
        // ESTRAZIONE RANDOM
        const randomKey = keysArray[Math.floor(Math.random() * keysArray.length)];
        const randomPokemon = pokemonData[randomKey];
        
        console.log(`[RANDOM] Input ricevuto: ${id} -> Risposta: ${randomPokemon}`);
        return res.send(`oggi sei ${randomPokemon}, il pokemon n° ${randomKey}`);
    }

    // RISPOSTA SPECIFICA
    const nome = pokemonData[id];
    console.log(`[SPECIFICO] ID: ${id} -> Nome: ${nome}`);
    res.send(`bre90sHype bre90sHype Il Pokémon n°${id} è ${nome}! bre90sHype bre90sHype`);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server attivo sulla porta ${PORT}`);
});
