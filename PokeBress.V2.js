const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

//////////////////////////////////////////////////////////////////////////////////////
// CARICAMENTO DATI 
//////////////////////////////////////////////////////////////////////////////////////
// Caricamento database Pokémon
let pokebressData = []; 
let emotePokemon = {};
let emoteTipi = {};
let maxId = 0;
let minId = 0;
let ultimo_pokemon = 1025;

// Carica json contenente lista pokebress (Array)
try {
    const fileContent = fs.readFileSync('pokebress.V2.json', 'utf8');
    pokebressData = JSON.parse(fileContent);
    
    // Estraiamo gli id_univoco per calcolare min e max
    const ids = pokebressData.map(p => Number(p.id_pokedex_nazionale));

    if (ids.length > 0) {
        maxId = Math.max(...ids);
        minId = Math.min(...ids);
    }
    console.log("✅ pokebress.V2.json caricato correttamente");
} catch (err) {
    console.error("❌ Errore lettura JSON pokebress.V2.json:", err);
}

// Carica emotes 
try {
    emotePokemon = require('./emotes.pokemon.json');
    console.log("✅ emotes.pokemon.json caricato correttamente");
} catch (err) {
    console.error("⚠️ AVVISO: Errore nel caricamento di emotes.pokemon.json.");
    emotePokemon = {};
}

// carica json contenente lista emotes tipi
try {
    emoteTipi = require('./emotes.tipi.json');
    console.log("✅ emotes.tipi.json caricato correttamente");
} catch (err) {
    console.error("⚠️ AVVISO: Errore nel caricamento di emotes.tipi.json.");
    emoteTipi = {};
}

// carica il file che traccia quante volte sono spawnati i pokemon dalla logica 2
const STATS_FILE = 'statistiche_random_pick.json';
let statsData = {};
try {
    if (fs.existsSync(STATS_FILE)) {
        statsData = JSON.parse(fs.readFileSync(STATS_FILE, 'utf8'));
        console.log("✅ statistiche_random_pick.json caricato correttamente.");
    }
} catch (err) {
    console.error("⚠️ AVVISO: errore caricamento statistiche_random_pick.json:", err);
}

/* TBU - serve collegamento a DB esterno per questa parte
// funzione per tracciare quante volte è spawnato un pokemon
const incrementaContatore = (id) => {
    // Se l'ID non esiste ancora nel JSON delle statistiche, lo inizializziamo a 0
    if (!statsData[id]) {
        statsData[id] = 0;
    }
    
    // Incrementiamo
    statsData[id]++;

    // Salviamo il file aggiornato
    fs.writeFile(STATS_FILE, JSON.stringify(statsData, null, 2), (err) => {
        if (err) console.error("❌ Errore salvataggio statistiche:", err);
    });
};
*/

//////////////////////////////////////////////////////////////////////////////////////
// CORPO DEL CODICE
//////////////////////////////////////////////////////////////////////////////////////

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
        if (!Array.isArray(tipiArray)) return "";
        return tipiArray.map(tipo => emoteTipi[tipo] || tipo).join('');
    };

    // 1. LOGICA DI RICERCA (ID specifico)
    // Cerchiamo l'oggetto nell'array che ha id_univoco uguale a inputId
    const pokemonTrovato = pokebressData.find(p => String(p.id_univoco) === String(inputId));

    if (inputId && pokemonTrovato) {
        // Applichiamo il limite maxId richiesto
        if (Number(inputId) <= maxId && Number(inputId) >= minId) { 
            const pokemon = pokemonTrovato;
            const emojiTipi = getEmojiTipi(pokemon.tipi);
            
            console.log(`ID univoco richiesto: ${inputId} -> id regionale: ${pokemon.id_pokedex_nazionale} -> ${pokemon.nome_storpiato}`);
            let message;
            
            if (emotePokemon[inputId]) {
                const emotePkm = emotePokemon[pokemon.id_pokedex_nazionale].emote;
                console.log(`-> Emote ${emotePkm} richiesta per pokemon ${emotePokemon[pokemon.id_pokedex_nazionale].nome_pokemon} || fonte = ${emotePokemon[pokemon.id_pokedex_nazionale].fonte}`)
                // Formattazione richiesta: n° ID è emojiTipi Nome Emote
                message = `il pokemon n° ${inputId} è ${emojiTipi} ${pokemon.nome_storpiato} ${emotePkm} , originario della regione di ${pokemon.regione} (gen. ${pokemon.generazione})`;
            } else {
                message = `il pokemon n° ${inputId} è ${emojiTipi} ${pokemon.nome_storpiato}, originario della regione di ${pokemon.regione} (gen. ${pokemon.generazione})`;
            }
            return res.send(message);
        }
    }

    // 2. LOGICA RANDOM
    if (inputId === "" && pokebressData.length > 0) {
        const randomIndex = Math.floor(Math.random() * pokebressData.length);
        const pokemon = pokebressData[randomIndex];
        const randomId = pokemon.id_univoco;
        /* TBU - serve collegamento a DB esterno per questa parte 
        incrementaContatore(randomId);
        */
        const emojiTipi = getEmojiTipi(pokemon.tipi);

        let shiny_string = '';
        const isShiny = Math.random() < 0.1; 
        console.log(`Flag isShiny = ${isShiny}`);
        if (isShiny) {
            shiny_string = ' shiny ✨';
        }

        let forma_string = '';
        switch (true) {
            case pokemon.forma.length > 0: 
                forma_string = ` ${pokemon.forma}`;
                break;
            default:
                forma_string = '';
        }

        let regione_string = '';
        if (randomId >= 10000 && randomId < 20000) { // tra questi valori di id_univoco ho piazzato le forme regionali nel json
            regione_string = ` di ${pokemon.regione}`;
        }

        let emotePkm_string = '';
        if (emotePokemon[randomId]) {
            const emotePkm = emotePokemon[pokemon.id_pokedex_nazionale].emote;
            emotePkm_string = `${emotePkm} `;
            console.log(`-> Emote ${emotePkm} richiesta per pokemon ${emotePokemon[pokemon.id_pokedex_nazionale].nome_pokemon} || fonte = ${emotePokemon[pokemon.id_pokedex_nazionale].fonte}`)
        }    

        console.log(`Input vuoto || ID randomizzato: ${randomId} -> id regionale: ${pokemon.id_pokedex_nazionale} -> ${pokemon.nome_storpiato} ${pokemon.regione} ${pokemon.forma}`);
        let message;

        switch (pokemon.id_univoco) {
            case 549: // Lilligant 
                message = `CONGRATULAZIONI!! ${emotePkm_string}${emotePkm_string} Oggi sei ${pokemon.nome_storpiato}${shiny_string} ${emojiTipi} ${emotePkm_string}${emotePkm_string} @bre90ss non snitchare e dagli il 💎 VIP 💎`;
                break;
            case 10048: // Lilligant Hisui
                message = `socio mi spiace, ti è andata male... Oggi sei ${emojiTipi} ${pokemon.nome_storpiato}${shiny_string}, ma della regione di ${pokemon.regione} 😒😒😒 Qui vige il culto del solo ed unico bre90sLilliBre `;
                break;
            case 6: // Charizard
                message = `GG socio 🏅🏅 Oggi sei ${emojiTipi} ${pokemon.nome_storpiato}${shiny_string} ${emotePkm_string}, @benedetta_leone_ hai visto che alla fine il tuo pokemon preferito è spawnato?`;
                break;
            case 656: // Froakie
                message = `socio oggi sei ${emojiTipi} ${pokemon.nome_storpiato}${shiny_string}, scrivi !froakie in chat per salutare @Iz_Giando`;
                break;
            case 181: // Ampharos
                message = `socio copertura di spalle MASSIMA: sei ${emojiTipi} ${pokemon.nome_storpiato}${shiny_string}, il pokemon che aiuterà @bre90ss a vincere una lettera del medagliere (🚔🚔flame al gestore se ciò non accade🚔🚔)`;
                break;
            case 263: // Zigzagoon
                message = `ZIG ZIG ZIG ZIG ZIG ZIG ZIG ZIG abbiamo ${emojiTipi} ${pokemon.nome_storpiato}${shiny_string}, sei entrato nelle grazie di @palmoziggozaggo ZIG ZIG ZIG ZIG ZIG ZIG ZIG ZIG`;
                break;
            case 10043: // Zigzagoon di Galar
                message = `socio ti è andata male... Oggi sei ${emojiTipi} ${pokemon.nome_storpiato}${shiny_string} della regione di ${pokemon.regione} 😒😒😒 (lo ${pokemon.nome_storpiato}${shiny_string} di WISH)`;
                break;
			case 128: // Tauros
                message = `MADÒ ${emojiTipi} ${pokemon.nome_storpiato}${shiny_string} FULL SPECIALE CON BOOMBURST STAB 🔊 🔊 🔊`;
                break;
            default:
                message = `oggi sei ${emojiTipi} ${pokemon.nome_storpiato}${regione_string}${forma_string}${shiny_string} ${emotePkm_string}, il pokemon n° ${pokemon.id_pokedex_nazionale} (gen. ${pokemon.generazione})`;
        }

        return res.send(message);
    }

    // 3. LOGICA INPUT NON ANCORA DEFINITI
    if (Number(inputId) >= maxId + 1 && Number(inputId) <= ultimo_pokemon && pokebressData.length > 0) {
        console.log(`Input non ancora presente "${inputId}" -> Fornire limiti operativi`)
        return res.send(`ad oggi puoi consultare il pokebress tra ${minId} e ${maxId} (@tha_acsam sta lavorando all'elenco completo...)`);
    }

    // 4. LOGICA PING
    if (inputId === 'PING' && pokebressData.length > 0) {
        console.log(`Input "PING" -> Fornire messaggio per PING avvenuto correttamente`)
        return res.send(`PING al server avvenuto correttamente`);
    }

    // 5. VISUALIZZAZIONE SCRIPT
    if (inputId === 'codice' && pokebressData.length > 0) {
        console.log(`Input "codice" -> Fornire link alla repository`)
        return res.send(`La repository è su github -> https://github.com/sc29-gls/Pokebress/blob/main`);
    }

    /* TBU - mi serve un DB esterno a cui collegarmi
    // 6. VISUALIZZAZIONE TOP 3 ESTRATTI
    if (inputId === 'stats' && pokebressData.length > 0) {
        console.log(`Input "stats" -> Fornire TOP 3 pokemon estratti`)
        const getTop3 = () => {
            const topArray = Object.entries(statsData)
                .map(([id, count]) => ({ id: Number(id), count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 3);

            return topArray.map((item, index) => {
                const pkmInfo = pokebressData.find(p => p.id_univoco === item.id);
                const nome = pkmInfo ? pkmInfo.nome_storpiato : "Sconosciuto";
                const regione = pkmInfo ? pkmInfo.regione : "";
                const forma = pkmInfo ? pkmInfo.forma : "";
                const emojiTipi = getEmojiTipi(pkmInfo.tipi);
                const medaglie = ["🥇", "🥈", "🥉"];
                const medaglia = medaglie[index];
                
                return `${medaglia}: ${emojiTipi} ${nome} ${forma} (${regione}) - spawnato ${item.count} volte`;
            }).join(' | ');
        };
        const messaggioTop3 = getTop3();
        return res.send(`🏆 TOP 3 BressMon spawnati -> ${messaggioTop3}`);
    }
    */

    // 7. LOGICA INPUT ERRATO
    if (pokebressData.length > 0) {
        console.log(`Input non valido "${inputId}" -> Fornire istruzioni comando`)
        return res.send(`il comando funziona nei seguenti casi: 🟢1. "${comando_twitch}" -> che pokebress sei 🟢2. "${comando_twitch} ###" -> nome pokebress con id ### (id tra ${minId} e ${maxId}) 🟢3. "${comando_twitch} codice" -> link alla repository completa`);
    } else {
        return res.status(500).send("Errore: Database Pokémon non caricato correttamente.");
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});
