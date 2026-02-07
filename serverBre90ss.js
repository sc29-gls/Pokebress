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

app.get('/pokedex/:id?', (req, res) => {
    let idParam = req.params.id;

    // GESTIONE INPUT DA STREAMELEMENTS
    // Se idParam è vuoto, oppure contiene la stringa letterale della variabile del bot
    if (!idParam || 
        idParam.trim() === "" || 
        idParam === "${1}" || 
        idParam === "undefined" || 
        idParam.startsWith("$")) {
        
        const keys = Object.keys(pokemonData);
        if (keys.length === 0) {
            return res.send(`bre90sFail Il database è vuoto!`);
        }
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const nomeRandom = pokemonData[randomKey];
        return res.send(`Oggi sei un ${nomeRandom}! bre90sHype bre90sHype`);
    }

    // Convertiamo l'input in numero
    const idNumerico = parseInt(idParam);

    // 2. GESTIONE ID NON VALIDO O OLTRE IL LIMITE
    if (isNaN(idNumerico) || idNumerico < 0 || idNumerico > ULTIMO_POKEMON_UFFICIALE) {
        return res.send(`L'ID "${idParam}" non è valido. Prova un numero tra 0 e ${ULTIMO_POKEMON_UFFICIALE} bre90sFail bre90sFail`);
    }

    // 3. RICERCA NEL DATABASE
    const nome = pokemonData[idNumerico];

    if (nome) {
        return res.send(`Il Pokémon n°${idNumerico} è ${nome}! bre90sFail bre90sHype`);
    } else {
        return res.send(`Il Pokebress non ha ancora registrato il n°${idNumerico} (max: ${maxId}) bre90sGufata bre90sGufata`);
    }
});

app.listen(PORT, () => {
    console.log(`Server Pokédex in esecuzione sulla porta ${PORT}`);
});
