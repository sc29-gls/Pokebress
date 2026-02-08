const express = require('express');
const cors = require('cors'); 
const fs = require('fs');
const app = express();

app.use(cors());
const PORT = process.env.PORT || 3000;

let pokemonData = {};
let keysArray = [];
let maxId = 0, minId = 0;

// Caricamento dati dal file JSON
try {
    const data = fs.readFileSync('pokebress.json', 'utf8');
    pokemonData = JSON.parse(data);
    const numericKeys = Object.keys(pokemonData).map(Number);
    keysArray = Object.keys(pokemonData);
    maxId = Math.max(...numericKeys);
    minId = Math.min(...numericKeys);
    console.log(`[STARTUP] Dati caricati. Range: ${minId}-${maxId}`);
} catch (err) {
    console.error("[ERROR] Fallimento caricamento JSON:", err);
}

// Rotta principale per StreamElements
app.get('/pokebress', (req, res) => {
    // Prendiamo l'input dalla query string (?id=...)
    let rawId = req.query.id ? req.query.id.trim() : "";
    console.log(`[LOG] Chiamata ricevuta. Input grezzo: "${rawId}"`);

    let idFinale = "";

    // 1. GESTIONE VARIABILE NON COMPILATA O VUOTA
    // Se l'input contiene simboli del bot ($ o {) o è solo la nostra 'q' di sicurezza
    if (rawId.includes("$") || rawId.includes("{") || rawId === "q" || !rawId) {
        idFinale = "q"; 
        console.log(`[LOGIC] Input non valido o vuoto. Impostato su "q" (Random).`);
    } 
    // 2. GESTIONE NUMERO (es. "45q")
    else if (/\d/.test(rawId)) { 
        idFinale = rawId.replace(/\D/g, ''); // Estrae solo i numeri: "45q" -> "45"
        console.log(`[LOGIC] Numero rilevato e pulito: "${idFinale}"`);
    } 
    // 3. FALLBACK GENERALE
    else {
        idFinale = "q";
    }

    const idNumerico = parseInt(idFinale);

    // LOGICA DI RISPOSTA: RANDOM O SPECIFICO
    if (!idFinale || isNaN(idNumerico) || idNumerico < minId || idNumerico > maxId || !pokemonData[idFinale]) {
        // Estrazione Pokémon Random
        const randomKey = keysArray[Math.floor(Math.random() * keysArray.length)];
