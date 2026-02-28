const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Caricamento database Pokémon
let pokebressData = {};
let emotePokemon = {};
let emoteTipi = {};
let maxId = 0;
let minId = 0;
let ultimo_pokemon = 1025;

// carica json contenente lista pokebress
try {
    const fileContent = fs.readFileSync('pokebress.json', 'utf8');
    pokebressData = JSON.parse(fileContent);
    
    const keys = Object.keys(pokebressData).map(Number);

    if (keys.length > 0) {
        maxId = Math.max(...keys);
        minId = Math.min(...keys);
    }
    console.log("✅ pokebress.json caricato correttamente.")
} catch (err) {
    console.error("❌ Errore lettura JSON pokebress.json:", err);
}

// carica json contenente lista emotes pokemon
try {
    emotePokemon = require('./emotes.pokemon.json');
    console.log("✅ emotes.pokemon.json caricato correttamente.");
} catch (err) {
    console.error("⚠️ AVVISO: Errore nel caricamento di emotes.pokemon.json.");
    emotePokemon = {};
}

// carica json contenente lista emotes tipi
try {
    emoteTipi = require('./emotes.tipi.json');
    console.log("✅ emotes.tipi.json caricato correttamente.");
} catch (err) {
    console.error("⚠️ AVVISO: Errore nel caricamento di emotes.tipi.json.");
    emoteTipi = {};
}

const keys = Object.keys(pokebressData);

app.get('/pokebress', (req, res) => {
    let inputId = req.query.id || "";
    let comando_twitch = '';
    const match = inputId.match(/^(!\w+)\s*/);

    if (match) {
        comando_twitch = match[1];
        inputId = inputId.replace(match[0], '').trim();
    }

    // --- FUNZIONE DI SUPPORTO PER TRASFORMARE TIPI IN EMOJI ---
    const getEmojiTipi = (tipiArray) => {
        return tipiArray.map(tipo => emoteTipi[tipo] || tipo).join(' ');
    };

    // 1. LOGICA DI RICERCA (ID specifico)
    if (inputId && pokebressData[inputId]) {
        const pokemon = pokebressData[inputId];
        const emojiTipi = getEmojiTipi(pokemon.tipi);
        
        console.log(`ID richiesto: ${inputId} -> ${pokemon.nome}`);
        let message;
        
        if (emotePokemon[inputId]) {
            const emotePkm = emotePokemon[inputId].emote;
            // Formattazione richiesta: n° ID è emojiTipi Nome Emote
            message = `il pokemon n° ${inputId} è ${emojiTipi} ${pokemon.nome} ${emotePkm} (gen. ${pokemon.gen})`;
        } else {
            message = `il pokemon n° ${inputId} è ${emojiTipi} ${pokemon.nome} (gen. ${pokemon.gen})`;
        }
        return res.send(message);
    }

    // 2. LOGICA RANDOM
    if (inputId === "" && keys.length > 0) {
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const pokemon = pokebressData[randomKey];
        const emojiTipi = getEmojiTipi(pokemon.tipi);

        
        console.log(`Input vuoto || ID randomizzato: ${randomKey} -> ${pokemon.nome}`);
        let message;

        if (emotePokemon[randomKey]) {
            const emotePkm = emotePokemon[randomKey].emote;
            switch (randomKey) {
                case '549':
                    message = `CONGRATULAZIONI!! ${emotePkm} ${emotePkm} Oggi sei ${pokemon.nome} ${emotePkm} ${emotePkm} Abbiamo la mascotte del canale!!`;
                    break;
                default:
                    message = `oggi sei ${emojiTipi} ${pokemon.nome} ${emotePkm}, il pokemon n° ${randomKey} (gen. ${pokemon.gen})`;
            }
        } else {
            message = `oggi sei ${emojiTipi} ${pokemon.nome}, il pokemon n° ${randomKey} (gen. ${pokemon.gen})`;
        }
        return res.send(message);
    }

    // 3. LOGICA INPUT NON ANCORA DEFINITI
    if (inputId >= maxId + 1 && inputId <= ultimo_pokemon && keys.length > 0) {
        return res.send(`ad oggi puoi consultare il pokebress tra ${minId} e ${maxId} (@tha_acsam sta lavorando all'elenco completo...)`);
    }

    // 4. LOGICA PING
    if (inputId === 'PING' && keys.length > 0) {
        return res.send(`PING al server avvenuto correttamente`);
    }

    // 5. VISUALIZZAZIONE ELENCO COMPLETO
    if (inputId === 'lista' && keys.length > 0) {
        return res.send(`qui trovi il file contenente tutto l'elenco attuale -> https://github.com/sc29-gls/Pokebress/blob/main/pokebress.json || qui trovi il file contenente le emote usate -> https://github.com/sc29-gls/Pokebress/blob/main/emotes.pokemon.json`);
    }

    // 6. LOGICA INPUT ERRATO
    if (keys.length > 0) {
        return res.send(`il comando funziona nei seguenti casi: 🟢1. "${comando_twitch}" -> che pokebress sei 🟢2. "${comando_twitch} ###" -> nome pokebress con id ### (valido ad oggi per id tra ${minId} e ${maxId}) 🟢3. "${comando_twitch} lista" -> file contenente tutto l'elenco`);
    } else {
        return res.status(500).send("Errore: Database Pokémon non caricato correttamente.");
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});
