console.log(localStorage.getItem("pokemonID"));

function get_pokemon(){
    $.ajax({
        url: `https://pokeapi.co/api/v2/pokemon/${localStorage.getItem("pokemonID")}`,
        type: "GET",
        success: display_pokemon
    })
}

function insert_timeline(pokemon){
    now = new Date(Date.now());
    formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    //console.log(filter);
    $.ajax({
        url: `/add_timeline`,
        type: "post",
        data: {
            activity: `user viewed profile of pokemon ${pokemon}`,
            hits: 0,
            time: now
        }
    })
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
}
function display_pokemon(pokemon){
    insert_timeline(pokemon.name);
    $("img").attr("src", `${pokemon.sprites.other["official-artwork"]["front_default"]}`);
    $("#pokemon_name").text(`${pokemon.name.toUpperCase()}`);
    $("#pokemon_id").text(`${pokemon.id}`);
    $("#hp").css("width", `${pokemon.stats[0]["base_stat"]/2}%`);
    $("#attack").css("width", `${pokemon.stats[1]["base_stat"]/2}%`);
    $("#defense").css("width", `${pokemon.stats[2]["base_stat"]/2}%`);
    $("#special_attack").css("width", `${pokemon.stats[3]["base_stat"]/2}%`);
    $("#special_defense").css("width", `${pokemon.stats[4]["base_stat"]/2}%`);
    $("#speed").css("width", `${pokemon.stats[5]["base_stat"]/2}%`);
    $("#additional_info").html(`<p>
    <button class="add" data=${pokemon.id} name=${pokemon.name}>Add to Cart</button>
    <h4 class="info">Type: </h4>${pokemon.types[0].type.name}</p>
    <p><h4 class="info">Weight: </h4>${pokemon.weight}</p>
    <p><h4 class="info">Height: </h4>${pokemon.height}</p>
    <p><h4 class="info">Ability: </h4>${pokemon.abilities[0].ability.name}</p>`)
}

function setup(){
    get_pokemon();
    $("body").on("click", ".add", add_to_cart);
}

$(document).ready(setup);