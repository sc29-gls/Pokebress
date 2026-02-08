const express = require('express');
const fs = require('fs');
const app = express();

// Porta dinamica per Render o 3000 per test locale
const port = process.env.PORT || 3000;

// Caricamento database Pokémon
let pokebressData = {};
try {
    pokebressData = JSON.parse(fs.readFileSync('pokebress.json', 'utf8'));
} catch (err) {
    console.error("Errore nel caricamento di pokebress.json:", err);
    console.error("Errore lettura JSON:", err);
}

const keys = Object.keys(pokebressData);

app.get('/pokebress', (req, res) => {
    const user = req.query.user || 'Ehi';
    const inputId = req.query.id;

    // LOGICA: 
    // Se l'utente ha inserito un ID 
    // E l'ID non è una variabile vuota di StreamElements
    // E l'ID esiste effettivamente nel JSON
    // LOGICA: Se l'ID è valido e presente nel JSON
    if (inputId && inputId !== "$(1)" && inputId !== "$(query)" && pokebressData[inputId]) {
        const pokemonName = pokebressData[inputId];
        const message = `@${user}, il pokemon n° ${inputId} è ${pokemonName} bre90sHype`;
        
        console.log(`[SPECIFICO] Utente: ${user} - ID: ${inputId}`);
        return res.send(message);
        // Restituisce solo la parte finale della frase
        return res.send(`il pokemon n° ${inputId} è ${pokemonName}`);
    }

    // FALLBACK / RANDOM:
    // Se l'ID è sbagliato, assente o non valido, sceglie a caso
    // FALLBACK: Caso Random
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomPokemon = pokebressData[randomKey];

    const message = `@${user} oggi sei ${randomPokemon}, il pokemon n° ${randomKey} bre90sHype bre90sHype`;
    
    console.log(`[RANDOM] Utente: ${user} - Estratto: ${randomKey}`);
    res.send(message);
    // Restituisce solo la frase randomica pura
    res.send(`oggi sei ${randomPokemon}, il pokemon n° ${randomKey}`);
});

// Avvio del server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server attivo sulla porta ${port}`);
});
