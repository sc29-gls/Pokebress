const express = require('express');
const cors = require('cors'); 
const fs = require('fs');
const app = express(); // <--- Questa è la riga che mancava prima

app.use(cors());

const PORT = process.env.PORT || 3000;

let pokemonData = {};
let maxId = 0;
const ULTIMO_POKEMON_UFFICIALE = 1025; 

// Caricamento database
try {
    const data = fs.readFileSync('pokebress.json', 'utf8');
    pokemonData = JSON.parse(data);
    const keys = Object.keys(pokemonData).map(Number);
    if (keys.length > 0) {
        maxId = Math.max(...keys);
    }
} catch (err) {
    console.error("Errore caricamento JSON:", err);
}

// Funzione Random
function mandaRandom(res) {
    const keys = Object.keys(pokemonData);
    if (keys.length === 0) return res.send(`bre90sFail Database vuoto!`);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return res.send(`Oggi sei un ${pokemonData[randomKey]}! bre90sHype bre90sHype`);
}

// Rotta
app.get('/pokedex/:id?', (req, res) => {
    const idParam = req.params.id;

    // Se l'input è vuoto o è la variabile non compilata di StreamElements (${1})
    if (!idParam || idParam.trim() === "" || idParam.includes('$') || idParam === 'undefined') {
        return mandaRandom(res);
    }

    const idNumerico = parseInt(idParam.trim());

    // Se l'utente scrive testo invece di un numero
    if (isNaN(idNumerico)) {
        return mandaRandom(res);
    }

    if (idNumerico < 0 || idNumerico > ULTIMO_POKEMON_UFFICIALE) {
        return res.send(`L'ID "${idNumerico}" non è valido. Prova 0-${ULTIMO_POKEMON_UFFICIALE} bre90sFail`);
    }

    const nome = pokemonData[idNumerico];
    if (nome) {
        return res.send(`Il Pokémon n°${idNumerico} è ${nome}! bre90sFail bre90sHype`);
    } else {
        return res.send(`Il Pokebress non ha ancora registrato il n°${idNumerico} (max: ${maxId}) bre90sGufata`);
    }
});

app.listen(PORT, () => {
    console.log(`Server attivo sulla porta ${PORT}`);
});
