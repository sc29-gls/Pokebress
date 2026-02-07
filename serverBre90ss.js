app.get('/pokedex/:id?', (req, res) => {
    let idParam = req.params.id;

    // 1. Pulizia dell'input: rimuoviamo spazi bianchi o residui
    const cleanInput = idParam ? idParam.trim() : "";
    const idNumerico = parseInt(cleanInput);

    // 2. CONTROLLO: È un numero valido tra 0 e 1025?
    if (!isNaN(idNumerico) && cleanInput !== "" && !cleanInput.startsWith("$")) {
        
        if (idNumerico < 0 || idNumerico > ULTIMO_POKEMON_UFFICIALE) {
            return res.send(`L'ID "${cleanInput}" non è valido. Prova tra 0 e ${ULTIMO_POKEMON_UFFICIALE} bre90sFail`);
        }

        const nome = pokemonData[idNumerico];
        if (nome) {
            return res.send(`Il Pokémon n°${idNumerico} è ${nome}! bre90sFail bre90sHype`);
        } else {
            return res.send(`Il Pokebress non ha ancora registrato il n°${idNumerico} (max: ${maxId}) bre90sGufata`);
        }
    }

    // 3. SE NON È UN NUMERO (o è vuoto, o è ${1}), SCATTA IL RANDOM
    const keys = Object.keys(pokemonData);
    if (keys.length === 0) return res.send(`bre90sFail Database vuoto!`);
    
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const nomeRandom = pokemonData[randomKey];
    return res.send(`Oggi sei un ${nomeRandom}! bre90sHype bre90sHype`);
});
