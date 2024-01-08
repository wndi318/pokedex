let pokemon = ["bulbasaur", "ivysaur", "venusaur", "charmander", "charmeleon", "charizard", "squirtle", "wartortle", "blastoise", "caterpie", "metapod", "butterfree", "weedle", "kakuna", "beedrill", "pidgey", "pidgeotto", "pidgeot", "rattata", "raticate", "spearow", "fearow", "ekans", "arbok", "pikachu", "raichu", "sandshrew", "sandslash", "nidoran-f", "nidorina", "nidoqueen", "nidoran-m", "nidorino", "nidoking", "clefairy", "clefable", "vulpix", "ninetales", "jigglypuff", "wigglytuff", "zubat", "golbat", "oddish", "gloom", "vileplume", "paras", "parasect", "venonat", "venomoth", "diglett", "dugtrio", "meowth", "persian", "psyduck", "golduck", "mankey", "primeape", "growlithe", "arcanine", "poliwag", "poliwhirl", "poliwrath", "abra", "kadabra", "alakazam", "machop", "machoke", "machamp", "bellsprout", "weepinbell", "victreebel", "tentacool", "tentacruel", "geodude", "graveler", "golem", "ponyta", "rapidash", "slowpoke", "slowbro", "magnemite", "magneton", "farfetchd", "doduo", "dodrio", "seel", "dewgong", "grimer", "muk", "shellder", "cloyster", "gastly", "haunter", "gengar", "onix", "drowzee", "hypno", "krabby", "kingler", "voltorb", "electrode", "exeggcute", "exeggutor", "cubone", "marowak", "hitmonlee", "hitmonchan", "lickitung", "koffing", "weezing", "rhyhorn", "rhydon", "chansey", "tangela", "kangaskhan", "horsea", "seadra", "goldeen", "seaking", "staryu", "starmie", "mr-mime", "scyther", "jynx", "electabuzz", "magmar", "pinsir", "tauros", "magikarp", "gyarados", "lapras", "ditto", "eevee", "vaporeon", "jolteon", "flareon", "porygon", "omanyte", "omastar", "kabuto", "kabutops", "aerodactyl", "snorlax", "articuno", "zapdos", "moltres", "dratini", "dragonair", "dragonite"];
let pokemonData = [];

let currentPokemon;
let currentPokemonIndex = 0;

async function renderPokemonInfo() {
    document.getElementById("loading-bar").classList.remove('d-none');
    for (let j = 0; j < 10; j++) {
        const query = pokemon[j];
        let pokelink = `https://pokeapi.co/api/v2/pokemon/${query}`;
        let response = await fetch(pokelink);
        currentPokemon = await response.json();
        let name = currentPokemon['name'];
        let picture = currentPokemon['sprites']['other']['dream_world']['front_default'];
        let number = currentPokemon['id'];
        let type = currentPokemon['types']['0']['type']['name'];
        let height = currentPokemon['height'];
        let weight = currentPokemon['weight'];
        let stats = currentPokemon['stats'];

        pokemonData.push({ name, number, type, height, weight, stats });

        generateCards(name, number, type, picture, j);
        changeBackgroundColor(type, j);
    }
    document.getElementById("loading-bar").classList.add('d-none');
}

function generateCards(name, number, type, picture, j) {
    document.getElementById('cards').innerHTML += /*html*/`
        <div id="card${j}" class="card-design" onclick="openCard(${j})">
            <div id="pokedex">
                <h2 id="pokemon-name">${name}</h2>
                <h3>#${number}</h3>
            </div>
            <div class="info-container">
                <h3 id="type">${type}</h3>
                <img id="pokemon-image" src=${picture}>
            </div>
        </div>
    `;
}

async function loadMore() {
    document.getElementById("loading-bar").classList.remove('d-none');

    let endIdx = pokemonData.length + 10;

    for (let j = pokemonData.length; j < endIdx && j < pokemon.length; j++) {
        let query = pokemon[j];
        let pokelink = `https://pokeapi.co/api/v2/pokemon/${query}`;
        let response = await fetch(pokelink);
        let currentPokemon = await response.json();
        let { name, id: number, types, height, weight, sprites, stats } = currentPokemon;
        let type = types[0].type.name;
        let picture = sprites.other.dream_world.front_default;

        pokemonData.push({ name, number, type, height, weight, stats });

        generateMoreCards(name, number, type, picture, j);
        changeBackgroundColor(type, j);
    }
    document.getElementById("loading-bar").classList.add('d-none');
}

function generateMoreCards(name, number, type, picture, j) {
    document.getElementById('cards').innerHTML += /*html*/`
        <div id="card${j}" class="card-design" onclick="openCard(${j})">
            <div id="pokedex">
                <h2 id="pokemon-name">${name}</h2>
                <h3>#${number}</h3>
            </div>
            <div class="info-container">
                <h3 id="type">${type}</h3>
                <img id="pokemon-image" src=${picture}>
            </div>
        </div>
    `;
}

async function changeBackgroundColor(type, j) {
    let card = document.getElementById(`card${j}`);

    const typeClassMapping = {
        'fire': 'feuer', 'water': 'wasser', 'grass': 'pflanze',
        'normal': 'braun', 'bug': 'kaefer', 'poison': 'gift',
        'ground': 'boden', 'fairy': 'fee', 'psychic': 'psycho',
        'fighting': 'kampf', 'rock': 'gestein', 'ghost': 'geist',
        'ice': 'eis', 'dragon': 'drache', 'default': 'none'
    };

    let className = typeClassMapping[type] || typeClassMapping['default'];
    card.classList.add(className);
}

function filterPokemon() {
    let search = document.getElementById('input').value.toLowerCase();

    for (let i = 0; i < pokemon.length; i++) {
        let element = pokemon[i];
        let card = document.getElementById(`card${i}`);
        
        if (element.toLowerCase().includes(search)) {
            handleVisibleCard(card, element, i);
        } else {
            handleHiddenCard(card);
        }
    }
}

function handleVisibleCard(card, element, index) {
    if (card) {
        card.classList.remove('d-none');
    } else {
        createPokemonCard(element, index);
    }
}

function handleHiddenCard(card) {
    if (card) {
        card.classList.add('d-none');
    }
}

function createPokemonCard(element, index) {
    const query = element;
    let pokelink = `https://pokeapi.co/api/v2/pokemon/${query}`;
    fetch(pokelink)
        .then(response => response.json())
        .then(currentPokemon => {
            let name = currentPokemon['name'];
            let picture = currentPokemon['sprites']['other']['dream_world']['front_default'];
            let number = currentPokemon['id'];
            let type = currentPokemon['types']['0']['type']['name'];
            pokemonData.push({ name, number, type });
            generateCards(name, number, type, picture, index);
            changeBackgroundColor(type, index);
        });
}

function openCard(j) {
    document.getElementById('cards').classList.add('filter');
    document.getElementById('show-card').classList.remove('d-none');
    document.getElementById('cards').classList.add('no-hover');
    document.getElementById('load').classList.add('filter');

    let smallCard = document.getElementById(`card${j}`);
    let name = smallCard.querySelector('#pokemon-name').textContent;
    let type = smallCard.querySelector('#type').textContent;
    let image = smallCard.querySelector('#pokemon-image').getAttribute('src');
    let backgroundColor = getComputedStyle(smallCard).backgroundColor;

    currentPokemonIndex = j;
    createBigCard(name, image, backgroundColor, type);
}

async function createBigCard(name, image, backgroundColor) {
    document.getElementById('show-card').innerHTML = /*html*/`
        <div class="big-card">
            <div class="poke-big" style="background-color: ${backgroundColor};">
                <img src="img/back.png" onclick="lastCard()">
                <img src="img/next.png" onclick="nextCard()">
                <h1>${name}</h1>
                <img src="img/close.png" onclick="closeCard()">
            </div>
            <div class="attributs">
                <div class="card-img">
                    <img src="${image}">
                </div>
                <div class="about">
                    <div class="menu">
                        <button onclick="showAbout()">About</button>
                        <button onclick="showStats()">Base Stats</button>
                    </div>
                    <div id="stats"></div>
                </div>
            </div>
        </div>
    `
        ;
    showAbout();
}

function showAbout() {
    let currentPokemonData = pokemonData[currentPokemonIndex];

    document.getElementById('stats').innerHTML = /*html*/`
        <table>
            <tr>
                <td>Number:</td>
                <td><b>#${currentPokemonIndex + 1}</b></td>
            </tr>
            <tr>
                <td>Name:</td>
                <td><b>${currentPokemonData.name}</b></td>
            </tr>
            <tr>
                <td>Type:</td>
                <td><b>${currentPokemonData.type}</b></td>
            </tr>
            <tr>
                <td>Height:</td>
                <td><b>${currentPokemonData.height}</b></td>
            </tr>
            <tr>
                <td>Weight:</td>
                <td><b>${currentPokemonData.weight}</b></td>
            </tr>
        </table>
    `;
}

function showStats() {
    let currentPokemonData = pokemonData[currentPokemonIndex];

    document.getElementById('stats').innerHTML = /*html*/`
        <h3>Base Stats</h3>
        <div class="progress-container">
            ${currentPokemonData.stats.map(stat => `
                <div class="progress-wrapper">
                    <div class="progress-label">${stat.stat.name}</div>
                    <progress class="progress-bar" max="100" value="${stat.base_stat}"></progress>
                </div>
            `).join('')}
        </div>
    `;
}


function nextCard() {
    if (currentPokemonIndex < pokemon.length - 1) {
        currentPokemonIndex++;
        let smallCard = document.getElementById(`card${currentPokemonIndex}`);
        let name = smallCard.querySelector('#pokemon-name').textContent;
        let type = smallCard.querySelector('#type').textContent;
        let image = smallCard.querySelector('#pokemon-image').getAttribute('src');
        let backgroundColor = getComputedStyle(smallCard).backgroundColor;
        createBigCard(name, image, backgroundColor, type);
    }
}

function lastCard() {
    if (currentPokemonIndex > 0) {
        currentPokemonIndex--;
        let smallCard = document.getElementById(`card${currentPokemonIndex}`);
        let name = smallCard.querySelector('#pokemon-name').textContent;
        let type = smallCard.querySelector('#type').textContent;
        let image = smallCard.querySelector('#pokemon-image').getAttribute('src');
        let backgroundColor = getComputedStyle(smallCard).backgroundColor;
        createBigCard(name, image, backgroundColor, type);
    }
}

function closeCard() {
    document.getElementById('show-card').classList.add('d-none');
    document.getElementById('cards').classList.remove('filter');
    document.getElementById('load').classList.remove('filter');
}

function reloadPage() {
    location.reload();
}