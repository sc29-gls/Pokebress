const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Caricamento database Pokémon
let pokebressData = {};
let maxId = 0;  // inizializza variabile indice massimo dell'elenco
let minId = 0;  // inizializza variabile indice minimo dell'elenco
let ultimo_pokemon = 1025;  // ultimo pokemon inserito nel pokedex da gamefreak @03/02/2026

try {
const fileContent = fs.readFileSync('pokebress.json', 'utf8');
    pokebressData = JSON.parse(fileContent);
    
    // 1. Estraiamo le chiavi e convertiamole subito in numeri
    const keys = Object.keys(pokebressData).map(Number);

    // 2. Calcoliamo min e max solo se il database non è vuoto
    if (keys.length > 0) {
        maxId = Math.max(...keys);
        minId = Math.min(...keys);
    }
} catch (err) {
    console.error("Errore lettura JSON:", err);
}

const keys = Object.keys(pokebressData);

app.get('/pokebress', (req, res) => {
    let inputId = req.query.id;
    let comando_twitch = ''
    const match = inputId.match(/^(!\w+)\s*/);
    // 0. PULIZIA DELL'INPUT
    // Se l'input contiene "!comando_twitch", lo rimuoviamo e prendiamo solo quello che resta (trim elimina gli spazi)
    if (match) {
        comando_twitch = match[1]; // Salva "!comando_twitch" 
        inputId = inputId.replace(match[0], '').trim(); // Rimuove tutto il blocco "comando_twitch" dall'input
    }

    // 1. LOGICA DI RICERCA (Se l'ID pulito esiste nel database)
    if (inputId && pokebressData[inputId]) {
        const pokemonName = pokebressData[inputId];
        console.log(`ID richiesto: ${inputId} -> ${pokemonName}`);
        return res.send(`il pokemon n° ${inputId} è ${pokemonName}`);
    }

    // 2. LOGICA RANDOM (Fallback se l'input è vuoto)
    if (inputId === "" && keys.length > 0) {
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const randomPokemon = pokebressData[randomKey];
        console.log(`Input vuoto || ID randomizzato: ${randomKey} -> ${randomPokemon}`);
        return res.send(`oggi sei ${randomPokemon}, il pokemon n° ${randomKey}`);
    } 

    // 3. LOGICA INPUT NON ANCORA DEFINITI -> tra maxId+1 e 1025
    if (inputId >= maxId+1 && inputId <= ultimo_pokemon && keys.length > 0) {
        console.log(`Input non ancora presente "${inputId}" -> Fornire limiti operativi`);
        return res.send(`ad oggi puoi consultare il pokebress tra ${minId} e ${maxId} (@tha_acsam sta lavorando all'elenco completo...)`);
    }

    // 4. LOGICA PER TRACCIARE PING NEI LOG -> il server si spegne se per 15 minuti rimane inattivo
    if (inputId === 'PING' && keys.length > 0) {
        console.log(`Input "${inputId}" -> Fornire messaggio ping avvenuto correttamente`);
        return res.send(`PING al server avvenuto correttamente`);
    }

    // 5. VISUALIZZAZIONE ELENCO COMPLETO
    if (inputId === 'lista' && keys.length > 0) {
        console.log(`Input "${inputId}" -> Fornire link a pokebress.json`);
        return res.send(`qui trovi il file contenente tutto l'elenco attuale -> https://github.com/sc29-gls/Pokebress/blob/main/pokebress.json`)
    }

    // 6. LOGICA INPUT ERRATO
    if (keys.length > 0) {
        console.log(`Input non valido "${inputId}" -> Fornire istruzioni comando`);
        return res.send(`il comando funziona nei seguenti casi: 🟢1. "${comando_twitch}" -> che pokebress sei 🟢2. "${comando_twitch} ###" -> nome pokebress con id ### (valido ad oggi per id tra ${minId} e ${maxId}) 🟢3. "${comando_twitch} lista" -> file contenente tutto l'elenco`);
    }
    else {
        return res.status(500).send("Errore: Database Pokémon non caricato correttamente.");
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});
