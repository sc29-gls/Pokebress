const express = require('express');
const cors = require('cors'); 
const fs = require('fs');
const app = express();

app.use(cors());

const PORT = process.env.PORT || 3000;

let pokemonData = {};
try {
    const data = fs.readFileSync('pokebress.json', 'utf8');
    pokemonData = JSON.parse(data);
} catch (err) {
    console.error("Errore nel caricamento del file JSON:", err);
}

app.get('/pokedex/:id', (req, res) => {
    const id = req.params.id;
    const idNumerico = parseInt(id);

    if (isNaN(idNumerico) || idNumerico < 0 || idNumerico > 151) {
        return res.status(400).send("Inserisci un ID valido tra 0 e 151.");
    }

    const nome = pokemonData[id];

    if (nome) {
        // Modifica applicata qui per l'output su Twitch
        res.send(`Il Pokémon n°${id} è ${nome}!`);
    } else {
        res.status(404).send(`Pokémon con ID ${id} non trovato.`);
    }
});

app.listen(PORT, () => {
    console.log(`Server Pokédex in esecuzione sulla porta ${PORT}`);
});
