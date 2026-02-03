const express = require('express');
const cors = require('cors'); 
const fs = require('fs');
const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
let pokemonData = {};
let maxId = 0;
let ultimo_pokemon = 1025; 

try {
    const data = fs.readFileSync('pokebress.json', 'utf8');
    pokemonData = JSON.parse(data);
    const keys = Object.keys(pokemonData).map(Number);
    if (keys.length > 0) maxId = Math.max(...keys);
    console.log(`Dati caricati. ID massimo trovato: ${maxId}`);
} catch (err) {
    console.error("Errore nel caricamento del file JSON:", err);
}

// Usiamo una rotta fissa, l'ID lo prendiamo dai parametri o dalla query
app.get('/pokedex', (req, res) => {
    // Cerchiamo l'ID in query string (?id=...) o se passato come parametro
    let id = req.query.id;
    const utente = req.query.user ? `@${req.query.user} ` : "";

    // Se l'ID è assente, vuoto o non numerico (caso random)
    if (!id || id.trim() === "" || id === "undefined" || id.includes("${")) {
        const keys = Object.keys(pokemonData);
        if (keys.length === 0) return res.send(`${utente}bre90sFail Database vuoto!`);
        
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const nomeRandom = pokemonData[randomKey];
        return res.send(`${utente}bre90sHype Oggi sei un ${nomeRandom} bre90sHype`);
    }

    const idNumerico = parseInt(id);

    if (isNaN(idNumerico) || idNumerico < 0 || idNumerico > ultimo_pokemon) {
        return res.send(`${utente}bre90sFail L'ID ${id} non è valido (0-${ultimo_pokemon}) bre90sFail`);
    }

    const nome = pokemonData[idNumerico];
    if (nome) {
        res.send(`${utente}bre90sHype Il Pokémon n°${idNumerico} è ${nome}! bre90sHype`);
    } else {
        res.send(`${utente}bre90sGufata Ad oggi il Pokebress è limitato tra 0 e ${maxId} bre90sGufata`);
    }
});

app.listen(PORT, () => console.log(`Server Pokédex attivo sulla porta ${PORT}`));
