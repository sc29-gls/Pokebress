app.get('/pokebress/:id?', (req, res) => {
    let rawId = req.params.id ? req.params.id.trim() : "";
    console.log(`[LOG] Input ricevuto: "${rawId}"`);

    let idFinale = "";

    // 1. Caso variabile non compilata: $(1)q o $(query)q
    if (rawId.includes("$(1)") || rawId.includes("$(query)")) {
        idFinale = "q"; // Teniamo solo la q
        console.log(`[LOGIC] Variabile rilevata. Forzo id a: "q"`);
    } 
    // 2. Caso numero sporco: 45q
    else if (/\d/.test(rawId)) { 
        idFinale = rawId.replace(/\D/g, ''); // Teniamo solo i numeri
        console.log(`[LOGIC] Numero rilevato. Pulito in: "${idFinale}"`);
    } 
    // 3. Tutto il resto (inclusa la q singola)
    else {
        idFinale = rawId;
        console.log(`[LOGIC] Nessun numero trovato. Mantengo: "${idFinale}"`);
    }

    const idNumerico = parseInt(idFinale);

    // LOGICA DI RISPOSTA
    if (!idFinale || isNaN(idNumerico) || idNumerico < minId || idNumerico > maxId || !pokemonData[idFinale]) {
        const randomKey = keysArray[Math.floor(Math.random() * keysArray.length)];
        const randomPokemon = pokemonData[randomKey];
        
        console.log(`[RESPONSE] RANDOM -> ${randomKey}`);
        return res.send(`oggi sei ${randomPokemon}, il pokemon n° ${randomKey}`);
    }

    // RISPOSTA SPECIFICA
    const nome = pokemonData[idFinale];
    console.log(`[RESPONSE] SPECIFICO -> ${idFinale}: ${nome}`);
    res.send(`bre90sHype bre90sHype Il Pokémon n°${idFinale} è ${nome}! bre90sHype bre90sHype`);
});
