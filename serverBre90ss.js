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

// IL FIX: :id? con il punto di domanda lo rende opzionale
app.get('/pokebress/:id?', (req, res) => {
    const id = req.params.id;
    const idNumerico = parseInt(id);

    // Se l'ID manca, è la stringa $(1), non è un numero o è fuori range
    if (!id || id === "$(1)" || isNaN(idNumerico) || idNumerico < minId || idNumerico > maxId || !pokemonData[id]) {
        const randomKey = keysArray[Math.floor(Math.random() * keysArray.length)];
        const randomPokemon = pokemonData[randomKey];
        console.log(`Id random = ${randomKey} || pokemon associato = ${randomPokemon}`);
        return res.send(`oggi sei ${randomPokemon}, il pokemon n° ${randomKey}`);
    }

    // Caso ID valido
    const nome = pokemonData[id];
    console.log(`Id scelto = ${id} || pokemon associato = ${nome}`);
    res.send(`Il Pokémon n°${id} è ${nome}!`);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Pokébress attivo sulla porta ${PORT}`);
});

