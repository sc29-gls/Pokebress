const express = require('express');
const cors = require('cors'); 
const fs = require('fs');
const app = express();

app.use(cors());

const PORT = process.env.PORT || 3000;

// Ricava i limii superiore ed inferiore del pokebress.json 
try {
    const data = fs.readFileSync('pokebress.json', 'utf8');
    pokemonData = JSON.parse(data);
    const keys = Object.keys(pokemonData).map(Number);
    maxId = Math.max(...keys);
    minId = Math.min(...keys);
    console.log(`Dati caricati. ID massimo trovato: ${maxId} || ID minimo trovato: ${minId}`);
} catch (err) {
    console.error("Errore nel caricamento del file JSON:", err);
}

app.get('/pokebress/:id', (req, res) => {
    const id = req.params.id;
    const idNumerico = parseInt(id);

    // 1. ID input non presente nel pokebress.json
    if (isNaN(idNumerico) || idNumerico < minId || idNumerico > maxId) {
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const randomPokemon = pokebressData[randomKey];
        console.log(`Id random = ${randomKey} || pokemon associato = ${randomPokemon}`);
        return res.send(`oggi sei ${randomPokemon}, il pokemon n° ${randomKey}`);
    }

    
    // 2. ID input presente nel pokebress.json
    const nome = pokemonData[id];
    console.log(`Id scelto = ${id} || pokemon associato = ${nome}`);
    res.send(`bre90sHype bre90sHype Il Pokémon n°${id} è ${nome}! bre90sHype bre90sHype `);
});

app.listen(PORT, () => {
    console.log(`Server Pokébress in esecuzione sulla porta ${PORT}`);
});
