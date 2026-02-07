const express = require('express');
const cors = require('cors'); 
const fs = require('fs');
const app = express();

app.use(cors());

const PORT = process.env.PORT || 3000;
const ULTIMO_POKEMON_UFFICIALE = 1025; 

let pokemonData = {};
let maxId = 0;

// Caricamento database all'avvio
try {
    const data = fs.readFileSync('pokebress.json', 'utf8');
    pokemonData = JSON.parse(data);
    const keys = Object.keys(pokemonData).map(Number);
    if (keys.length > 0) {
        maxId = Math.max(...keys);
    }
    console.log(`Database caricato: ${keys.length} Pokémon pronti.`);
} catch (err) {
    console.error("Errore critico caricamento JSON:", err);
}

// Funzione per estrarre un Pokémon casuale
function mandaRandom(res) {
    const keys = Object.keys(pokemonData);
    if (keys.length === 0) return res.send(`bre90sFail Database vuoto!`);
    
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const nome = pokemonData[randomKey];
    return res.send(`Oggi sei un ${nome}! bre90sHype bre90sHype`);
}

// Rotta principale per StreamElements
app.get('/pokedex', (req, res) => {
    // Leggiamo l'input dalla query string: ?id=valore
    const idParam = req.query.id;

    // Log di debug per vedere cosa arriva dal bot
    console.log(`Richiesta ricevuta - Input: "${idParam}"`);

    // GESTIONE CASO: Nessun input o variabile non compilata da StreamElements
    if (!idParam || 
        idParam.trim() === "" || 
        idParam === 'undefined' || 
        idParam === 'null' || 
        idParam.includes('$')) {
        return mandaRandom(res);
    }

    const idNumerico = parseInt(idParam.trim());

    // GESTIONE CASO: L'input non è un numero (es: !p ciao)
    if (isNaN(idNumerico)) {
        return mandaRandom(res);
    }

    // GESTIONE CASO: Numero fuori range ufficiale
    if (idNumerico < 0 || idNumerico > ULTIMO_POKEMON_UFFICIALE) {
        return res.send(`L'ID "${idNumerico}" non è valido. Prova 0-${ULTIMO_POKEMON_UFFICIALE} bre90sFail`);
    }

    // Ricerca nel dizionario
    const nome = pokemonData[idNumerico];
    if (nome) {
        return res.send(`Il Pokémon n°${idNumerico} è ${nome}! bre90sHype`);
    } else {
        return res.send(`Il Pokebress non ha ancora registrato il n°${idNumerico} (max registrato: ${maxId}) bre90sGufata`);
    }
});

app.listen(PORT, () => {
    console.log(`Server attivo sulla porta ${PORT}`);
});
