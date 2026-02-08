app.get('/pokebress', (req, res) => {
    const user = req.query.user || 'Ehi';
    const inputId = req.query.id; // Prendiamo l'ID passato dal comando

    // Se l'ID è fornito ed esiste nel nostro JSON
    if (inputId && pokebressData[inputId]) {
        const pokemonName = pokebressData[inputId];
        const message = `@${user}, il pokemon n° ${inputId} è ${pokemonName} bre90sHype`;
        console.log(`Risposta ID specifico: ${message}`);
        return res.send(message);
    }

    // Caso Random (se l'ID non è fornito, non è un numero o non è nel range)
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomPokemon = pokebressData[randomKey];
    
    const message = `@${user} oggi sei ${randomPokemon}, il pokemon n° ${randomKey} bre90sHype`;
    console.log(`Risposta random: ${message}`);
    res.send(message);
});
