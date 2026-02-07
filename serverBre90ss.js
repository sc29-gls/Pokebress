const express = require('express');
const cors = require('cors'); 
const fs = require('fs');
const app = express();

app.use(cors());

const PORT = process.env.PORT || 3000;

let pokemonData = {};
let maxId = 0;
const ULTIMO_POKEMON_UFFICIALE = 1025; 

// Caricamento database JSON
try {
    const data = fs.readFileSync('pokebress.json', 'utf8');
    pokemonData = JSON.parse(data);
    const keys = Object.keys(pokemonData).map(Number);
    if (keys.length > 0) {
        maxId = Math.max(...keys);
    }
    console.log(`Dati caricati. ID massimo trovato: ${maxId}`);
} catch (err) {
    console.error("Errore nel caricamento del file JSON:", err);
}

// Funzione helper per il random (definita prima dell'uso)
function mandaRandom(res) {
    const keys = Object.keys(pokemonData);
    if (keys.length === 0) {
        return res.send(`bre90sFail Il database è vuoto!`);
    }
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const nomeRandom = pokemonData[randomKey];
    return res.send(`Oggi sei un ${nomeRandom}! bre90sHype bre90sHype`);
}

// ROTTA PRINCIPALE
app.get('/pokedex/:id?', (req, res) => {
    const idParam = req.params.id;

    // 1. GESTIONE INPUT VUOTO O VARIABILI STREAMELEMENTS
    // Se non c'è parametro, o se contiene il simbolo $ o è undefined
    if (!idParam || idParam.trim() === "" || idParam.includes('$') || idParam === 'undefined') {
        return mandaRandom(res);
    }

    // 2. PULIZIA E CONVERSIONE
    const cleanInput = idParam.trim();
    const idNumerico = parseInt(cleanInput);

    // Se l'utente ha scritto del testo (es. !p ciao) invece di un numero
    if (isNaN(idNumerico)) {
        return mandaRandom(res);
    }

    // 3. LOGICA RANGE
    if (idNumerico < 0 || idNumerico > ULTIMO_POKEMON_UFFICIALE) {
        return res.send(`L'ID "${cleanInput}" non è valido. Prova tra 0 e ${ULTIMO_POKEMON_UFFICIALE} bre90sFail`);
    }

    const nome = pokemonData[idNumerico];

    if (nome) {
        return res.send(`Il Pokémon n°${idNumerico} è ${nome}! bre90sFail bre90sHype`);
    } else {
        return res.send(`Il Pokebress non ha ancora registrato il n°${idNumerico} (max: ${maxId}) bre90sGufata`);
    }
});

app.listen(PORT, () => {
    console.log(`Server Pokédex in esecuzione sulla porta ${PORT}`);
});
