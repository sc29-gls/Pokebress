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
    const idParam = req.params.id;
    // Recupera l'utente, se manca mette stringa vuota
    const utente = req.query.user ? `@${req.query.user} ` : "";

    // 1. GESTIONE INPUT ASSENTE (Random)
    // Entra qui se l'ID non è passato o se è una stringa vuota
    if (!idParam || idParam.trim() === "") {
        const keys = Object.keys(pokemonData);
        if (keys.length === 0) {
            return res.send(`${utente}bre90sFail Il database è vuoto!`);
        }
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const nomeRandom = pokemonData[randomKey];
        return res.send(`${utente} oggi sei un ${nomeRandom}! bre90sHype bre90sHype`);
    }

    // Convertiamo l'input in numero
    const idNumerico = parseInt(idParam);

    // 2. GESTIONE ID NON VALIDO O OLTRE IL LIMITE ( > 1025 )
    // Controlliamo se non è un numero, se è negativo o se supera l'ultimo Pokémon ufficiale
    if (isNaN(idNumerico) || idNumerico < 0 || idNumerico > ULTIMO_POKEMON_UFFICIALE) {
        return res.send(`${utente} l'ID "${idParam}" non è valido. Prova un numero tra 0 e ${ULTIMO_POKEMON_UFFICIALE} bre90sFail bre90sFail`);
    }

    // 3. RICERCA NEL DATABASE
    const nome = pokemonData[idNumerico];

    if (nome) {
        return res.send(`${utente} il Pokémon n°${idNumerico} è ${nome}! bre90sFail bre90sHype`);
    } else {
        // Caso in cui l'ID è valido (0-1025) ma non è presente nel tuo file JSON
        return res.send(`${utente} il Pokebress non ha ancora registrato il n°${idNumerico} (max: ${maxId}) bre90sGufata bre90sGufata`);
    }
});

app.listen(PORT, () => {
    console.log(`Server Pokédex in esecuzione sulla porta ${PORT}`);
});
