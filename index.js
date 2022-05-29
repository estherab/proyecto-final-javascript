const N = 150;
let arrayPokemon = [];
let pokedex = document.querySelector(".pokedex");
let search = document.querySelector(".pokemon-search");

const colours = {
    grass: "#D4F0D7",
    fire: "#F3CAAF",
    water: "#D1F5F9",
    bug: "#D4F0D7",
    normal: "#EBEAEC",
    poison: "#F5ABB3",
    electric: "#F3CAAF",
    ground: "#C7B3A6",
    fairy: "#E0D8F9",
    fighting: "#F5ABB3",
    psychic: "#EBEAEC",
    rock: "#C7B3A6",
    ghost: "#F5D7AB",
    ice: "#D1F5F9",
    dragon: "#E0D8F9"
}

const callApi = async () => {
    const dataApi = await (await fetch("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=150")).json();
    let pokemon = ""; 

    for (let i = 0; i < N; i++) {
        pokemon = await (await fetch(dataApi.results[i].url)).json();      
        arrayPokemon.push(pokemon);
    }

    show(arrayPokemon);
}

const padLeadingZeros = (num, size) => {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

const createPokemon = (pokemon) => {

    let card = document.createElement("div");

    card.className = "pokemon";

    showFront(card, pokemon);

    pokedex.appendChild(card);

    card.addEventListener("click", (event) => {
        if (card.className == "backCard")
            showFront(card, pokemon);

        else {
            showFeatures(card, pokemon);
        }
    });
}

const showFront = (card, pokemon) => {
    card.innerHTML = "";
    card.className = "pokemon";

    let id = document.createElement("id");
    id.classList.add("pokemon-id");
    id.textContent = "#" + padLeadingZeros(pokemon.id, 3);

    let name = document.createElement("h2");
    name.classList.add("pokemon-name");
    name.textContent = pokemon.forms[0].name[0].toString().toUpperCase() + pokemon.forms[0].name.toString().substring(1);

    let image = document.createElement("img");
    image.classList.add("pokemon-image");
    image.setAttribute("src", pokemon.sprites.other.dream_world.front_default);

    let types = document.createElement("div");
    types.classList.add("container-types");

    let type0 = document.createElement("p");
    type0.classList.add("pokemon-type");
    type0.textContent = pokemon.types[0].type.name[0].toString().toUpperCase() + pokemon.types[0].type.name.toString().substring(1);
    types.appendChild(type0);

    if (pokemon.types[1]) {
        let type1 = document.createElement("p");
        type1.classList.add("pokemon-type");
        type1.textContent = pokemon.types[1].type.name[0].toString().toUpperCase() + pokemon.types[1].type.name.toString().substring(1);
        types.appendChild(type1);
    }

    card.style.backgroundColor = colours[pokemon.types[0].type.name.toString()];

    card.appendChild(id);
    card.appendChild(name);
    card.appendChild(image);
    card.appendChild(types);
}

const showFeatures = (card, pokemon) => {
    card.innerHTML = "";
    card.className = "backCard";

    let weightContainer = document.createElement("div");
    weightContainer.classList.add("container-weight");

    let weightIcon = document.createElement("img");
    weightIcon.classList.add("icon");
    weightIcon.setAttribute("src", "./weight.png");

    let weight = document.createElement("p");
    weight.classList.add("feature");
    weight.textContent = pokemon.weight / 10 + " kg.";

    weightContainer.appendChild(weightIcon);
    weightContainer.appendChild(weight);

    let heightIcon = document.createElement("img");
    heightIcon.classList.add("icon");
    heightIcon.setAttribute("src", "./height.png");

    let heightContainer = document.createElement("div");
    heightContainer.classList.add("container-height");

    let height = document.createElement("p");
    height.classList.add("feature");
    height.textContent = pokemon.height / 10 + " m";

    heightContainer.appendChild(heightIcon);
    heightContainer.appendChild(height)

    card.appendChild(weightContainer);
    card.appendChild(heightContainer);

    let powerIcon = document.createElement("img");
    powerIcon.classList.add("icon");
    powerIcon.classList.add("icon-power");
    powerIcon.setAttribute("src", "./power.png");

    card.appendChild(powerIcon);

    let movesContainer = document.createElement("div");
    movesContainer.classList.add("container-moves");

    for (let i = 0; i < 5; i++) {
        let move = document.createElement("p");
        move.classList.add("feature");
        move.textContent = pokemon.moves[i].move.name;
        movesContainer.appendChild(move);
    }

    card.appendChild(movesContainer);
}

const show = (pokemons) => {
    pokedex.innerHTML = "";

    for (let i = 0; i < pokemons.length; i++) {       
        createPokemon(pokemons[i]);
    }
};

const searchPokemons = () => {
    let pokemonsWanted = [];

    for (let i = 0; i < arrayPokemon.length; i++) {
        if (arrayPokemon[i].forms[0].name.toLowerCase().includes(search.value.toLowerCase())) 
            pokemonsWanted.push(arrayPokemon[i]);

        else if (arrayPokemon[i].id === Number(search.value))
            pokemonsWanted.push(arrayPokemon[i])
    }

    show(pokemonsWanted);
}

const filterPokemon = (type) => {

    if (type == "all")
        return show(arrayPokemon);

    else {
        const pokemonsFiltered = arrayPokemon.filter((pokemon) => {
            let matchFirstType = false;
            let matchSecondType = false;
        
            if (pokemon.types[1]) 
                matchSecondType = pokemon.types[1].type.name === type;
        
            if (pokemon.types[0]) 
                matchFirstType = pokemon.types[0].type.name === type;

            return matchFirstType || matchSecondType;
        });

        show(pokemonsFiltered);
    }
}

const init = () => {
    callApi();

    search.addEventListener("input", (event) => {
        searchPokemons();
    });

    document.querySelectorAll(".filter").forEach((button) => {
        button.addEventListener("click", (event) => {
            filterPokemon(event.target.classList[1]);
        });
    });
}

window.onload = init;

