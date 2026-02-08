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
} catch (err) {
    console.error("Errore caricamento JSON:", err);
}

// Gestisce sia /pokebress/ che /pokebress/ID
app.get('/pokebress/:id?', (req, res) => {
    let id = req.params.id;

    // Se StreamElements manda "?" o "$(1)", lo puliamo
    if (id) {
        id = id.replace('?', '').trim();
    }

    const idNumerico = parseInt(id);

    // LOGICA RANDOM: scatta se l'ID manca, è testuale, o fuori range
    if (!id || id === "" || id === "$(1)" || isNaN(idNumerico) || idNumerico < minId || idNumerico > maxId || !pokemonData[id]) {
        const randomKey = keysArray[Math.floor(Math.random() * keysArray.length)];
        const randomPokemon = pokemonData[randomKey];
        return res.send(`oggi sei ${randomPokemon}, il pokemon n° ${randomKey}`);
    }

    // LOGICA SPECIFICA
    const nome = pokemonData[id];
    res.send(`bre90sHype bre90sHype Il Pokémon n°${id} è ${nome}! bre90sHype bre90sHype`);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server attivo sulla porta ${PORT}`);
});
