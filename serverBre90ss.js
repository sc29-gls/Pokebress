const express = require('express');
const cors = require('cors'); 
const fs = require('fs');
const app = express();

app.use(cors());

const PORT = process.env.PORT || 3000;

let pokemonData = {};
let maxId = 0;
let ultimo_pokemon = 1025; // Ultimo Pokémon ufficiale al 03/02/2026

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

// Rotta principale con ID opzionale
app.get('/pokedex/:id?', (req, res) => {
    let id = req.params.id;
    
    // Recupera il nome utente dalla query string (es. ?user=nomeutente)
    // Se presente aggiunge la @ e uno spazio, altrimenti stringa vuota
    const utente = req.query.user ? `@${req.query.user} ` : "";

    // CASO RANDOM (se non viene passato l'ID)
    if (id === undefined) {
        const keys = Object.keys(pokemonData);
        if (keys.length === 0) {
            return res.send(`${utente}bre90sFail bre90sFail Il database è vuoto! bre90sFail bre90sFail`);
        }
        
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const nomeRandom = pokemonData[randomKey];
        
        return res.send(`${utente}bre90sHype bre90sHype Oggi sei un ${nomeRandom} bre90sHype bre90sHype`);
    }

    const idNumerico = parseInt(id);

    // 1. Controllo validità numerica (formato o range ufficiale)
    if (isNaN(idNumerico) || idNumerico < 0 || idNumerico > ultimo_pokemon) {
        return res.send(`${utente}bre90sFail bre90sFail L'ID ${id} non è valido. Inserisci un numero tra 0 e ${ultimo_pokemon} bre90sFail bre90sFail`);
    }

    const nome = pokemonData[id];

    // 2. Controllo esistenza nome nel database locale
    if (nome) {
        res.send(`${utente}bre90sHype bre90sHype Il Pokémon n°${id} è ${nome}! bre90sHype bre90sHype`);
    } else {
        res.send(`${utente}bre90sGufata bre90sGufata Ad oggi il Pokebress è limitato tra 0 e ${maxId} bre90sGufata bre90sGufata`);
    }
});

app.listen(PORT, () => {
    console.log(`Server Pokédex in esecuzione sulla porta ${PORT}`);
});