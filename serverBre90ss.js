const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Carica il file JSON
// Assicurati che il file si chiami esattamente pokebress.json nel tuo GitHub
const pokebressData = JSON.parse(fs.readFileSync('pokebress.json', 'utf8'));
const keys = Object.keys(pokebressData);

app.get('/pokebress', (req, res) => {
    const user = req.query.user || 'Ehi';
    const inputId = req.query.id; 

    // 1. Logica: Se l'utente ha inserito un ID e questo esiste nel JSON
    if (inputId && pokebressData[inputId]) {
        const pokemonName = pokebressData[inputId];
        const message = `@${user}, il pokemon n° ${inputId} è ${pokemonName} bre90sHype`;
        console.log(`Risposta specifica: ${message}`);
        return res.send(message);
    }

    // 2. Logica: Caso Random (se l'ID manca, è sbagliato o non in elenco)
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomPokemon = pokebressData[randomKey];
    
    const message = `@${user} oggi sei ${randomPokemon}, il pokemon n° ${randomKey} bre90sHype bre90sHype`;
    console.log(`Risposta random: ${message}`);
    res.send(message);
});

// Avvio del server su 0.0.0.0 per Render
app.listen(port, '0.0.0.0', () => {
    console.log(`Server attivo sulla porta ${port}`);
});
