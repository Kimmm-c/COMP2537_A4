function get_pokemons() {
    $.ajax({
        url: `https://pokeapi.co/api/v2/pokemon/?limit=50&offset=50`,
        type: "GET",
        success: display_pokemons
    })
}

function display_pokemons(pokemons) {
    //console.log(pokemons.results[0].url);
    //$("#pokemons_display").html(pokemons.results[0].name);
    for (count = 0; count < 9; count++) {
        $.ajax({
            url: `${pokemons.results[Math.floor(Math.random() * 50)].url}`,
            type: "GET",
            success: render_each_pokemon
        })
    }
}

function render_each_pokemon(pokemon) {
    //console.log(pokemon.height);
    //console.log(pokemon.sprites.other["official-artwork"]["front_default"]);
    $("#pokemons_display").append(`<div class="pokemon">
    <a href="profile.html" class="pokemon_info" id=${pokemon.id}>
    <img src=${pokemon.sprites.other["official-artwork"]["front_default"]}>
    ${pokemon.name.toUpperCase()}</a>
    <button class="add" data=${pokemon.id} name=${pokemon.name}>Add to Cart</button></div>`)

}

function save_to_storage() {
    localStorage.setItem("pokemonID", $(this).attr("id"));
}

function add_to_cart() {
    // console.log($(this).attr("data"))
    //console.log($(this).attr("name"))
    $.ajax({
        url: `/add_to_cart`,
        type: "put",
        data: {
            poke_name: $(this).attr("name"),
            poke_id: $(this).attr("data"),
            price: $(this).attr("data")
        },
        success: (message) => {
            if(message == "success"){
                console.log('pokemon added')
            }
        }
    })
    // $.post('/add_to_cart', {
    //     poke_name: $(this).attr("name"),
    //     poke_id: $(this).attr("data"),
    //     price: $(this).attr("data")
    // },
    // (message)=>{

    // })
}

function setup() {
    get_pokemons();
    $("body").on("click", ".pokemon_info", save_to_storage);
    $("body").on("click", ".add", add_to_cart);

}

$(document).ready(setup);