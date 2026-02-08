app.get('/pokebress/:id?', (req, res) => {
    // Controlliamo sia il parametro (/12) che la query (?q)
    let rawId = req.params.id ? req.params.id.trim() : "";
    let queryKeys = Object.keys(req.query);
    
    console.log(`[LOG] Param: "${rawId}" | Query: "${queryKeys}"`);

    let idFinale = "";

    // Se l'ID contiene la variabile non compilata
    if (rawId.includes("$(1)") || rawId.includes("$(query)")) {
        idFinale = "q";
    } 
    // Se c'è un numero nel parametro
    else if (/\d/.test(rawId)) {
        idFinale = rawId.replace(/\D/g, '');
    } 
    // Se il parametro è vuoto ma c'è qualcosa nella query (come la nostra 'q')
    else if (!rawId && queryKeys.length > 0) {
        idFinale = queryKeys[0]; // Prende 'q' da ?q
    }
    else {
        idFinale = rawId || "q";
    }

    const idNumerico = parseInt(idFinale);
    console.log(`[LOG] Elaborato finale: "${idFinale}"`);

    if (!idFinale || isNaN(idNumerico) || idNumerico < minId || idNumerico > maxId || !pokemonData[idFinale]) {
        const randomKey = keysArray[Math.floor(Math.random() * keysArray.length)];
        const randomPokemon = pokemonData[randomKey];
        return res.send(`oggi sei ${randomPokemon}, il pokemon n° ${randomKey}`);
    }

    const nome = pokemonData[idFinale];
    res.send(`bre90sHype bre90sHype Il Pokémon n°${idFinale} è ${nome}! bre90sHype bre90sHype`);
});
