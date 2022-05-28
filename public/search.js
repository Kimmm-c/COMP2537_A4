function get_pokemons() {
    $("#pokemons_display").empty();
    keyword = $("#search_keyword").val();
    select = document.getElementById("filter");
    filter = select.options[select.selectedIndex].value;

    if (filter == "name") {
        if (keyword.toUpperCase() == keyword.toLowerCase()) {
            $("#pokemons_display").text("Invalid input. Must be letters only.")
        } else {
            get_pokemon_by_name(keyword);
            $("#display_history").append(`<div><button class="retrieve_history" key="name" val=${keyword}>name ${keyword}</button>
        <button class="remove_history_tag">x</button></div>`)
        }
    } else if (filter == "dex_num") {
        if (isNaN(keyword) || keyword > 28 || keyword < 1) {
            $("#pokemons_display").text("Invalid input. Must be number from 1 - 28 only.")
        } else {
            get_pokedex(keyword);
            $("#display_history").append(`<div><button class="retrieve_history" key="pokedex" val=${keyword}>pokedex ${keyword}</button>
        <button class="remove_history_tag">x</button></div>`)
        }
    }
    insert_timeline(filter);
    $("#search_keyword").val("");
}

function insert_timeline(filter){
    now = new Date(Date.now());
    formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    console.log(filter);
    $.ajax({
        url: `/add_timeline`,
        type: "post",
        data: {
            activity: `You searched for pokemon by ${filter}`,
            hits: 0,
            time: now
        }
    })
}

function get_pokedex(dex_num) {
    $.ajax({
        url: `https://pokeapi.co/api/v2/pokedex/${dex_num}`,
        type: "GET",
        success: process_dex
    })
}

function process_dex(pokemons) {
    //console.log(pokemons["pokemon_entries"][0]["pokemon_species"].name);
    //console.log(pokemons["pokemon_entries"].lenght);
    for (count = 0; count < pokemons["pokemon_entries"].length; count++) {
        $.ajax({
            url: `https://pokeapi.co/api/v2/pokemon/${pokemons["pokemon_entries"][count]["pokemon_species"].name}`,
            type: "GET",
            success: process_pokemon
        })
    }
}

function get_pokemon_by_name(keyword) {
    $.ajax({
        url: `https://pokeapi.co/api/v2/pokemon/${keyword}`,
        type: "GET",
        success: process_pokemon
    })
}

function display_options() {
    select = document.getElementById("filter");
    filter = select.options[select.selectedIndex].value;
    console.log(filter);
    if (filter == "habitat") {
        $("#types").css("display", "none");
        $("#habitats").css("display", "");
    } else if (filter == "type") {
        $("#habitats").css("display", "none");
        $("#types").css("display", "");
    } else {
        $("#types").css("display", "none");
        $("#habitats").css("display", "none");
    }
}

function get_pokemons_habitat() {
    $("#pokemons_display").empty();
    select = document.getElementById("habitat")
    habitat = select.options[select.selectedIndex].value;
    //console.log(habitat);
    $.ajax({
        url: `https://pokeapi.co/api/v2/pokemon-habitat/${habitat}`,
        type: "GET",
        success: get_pokemon
    })
    insert_timeline(`habitat: ${habitat}`);
    $("#display_history").append(`<div><button class="retrieve_history" key="habitat" val=${habitat}>habitat ${habitat}</button>
    <button class="remove_history_tag">x</button></div>`)
}


function get_pokemon(pokemons) {
    //console.log(pokemons["pokemon_species"].length);
    for (count = 0; count < pokemons["pokemon_species"].length; count++) {
        //console.log(pokemons["pokemon_species"][count].name);
        $.ajax({
            url: `https://pokeapi.co/api/v2/pokemon/${pokemons["pokemon_species"][count].name}`,
            type: "GET",
            success: process_pokemon
        })
    }
}


function get_pokemons_type() {
    $("#pokemons_display").empty();
    select = document.getElementById("type");
    type = select.options[select.selectedIndex].value;
    $.ajax({
        url: `https://pokeapi.co/api/v2/type/${type}`,
        type: "GET",
        success: get_pokemon_one_type
    })
    insert_timeline(`type: ${type}`);
    $("#display_history").append(`<div><button class="retrieve_history" key="type" val=${type}>type ${type}</button>
    <button class="remove_history_tag">x</button></div>`)
}

function get_pokemon_one_type(pokemons) {
    //console.log(pokemons["pokemon"].length);
    for (count = 0; count < pokemons["pokemon"].length; count++) {
        //console.log(pokemons["pokemon_species"][count].name);
        $.ajax({
            url: `https://pokeapi.co/api/v2/pokemon/${pokemons.pokemon[count].pokemon.name}`,
            type: "GET",
            success: process_pokemon
        })
    }
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
function process_pokemon(pokemon) {
    //console.log(pokemon.name);
    $("#pokemons_display").append(`<div class="pokemon">
    <a href="profile.html" id=${pokemon.id} class="pokemon_name">
    <h4>${pokemon.id}</h4>
    <img src=${pokemon.sprites.other["official-artwork"]["front_default"]}>
    ${pokemon.name.toUpperCase()}</a>
    <button class="add" data=${pokemon.id} name=${pokemon.name}>Add to Cart</button>
    </div`)
}

function save_to_storage() {
    localStorage.setItem("pokemonID", $(this).attr("id"));
}

function retrieve_history() {
    key = $(this).attr("key");
    val = $(this).attr("val");
    $("#pokemons_display").empty();
    if (key == "name") {
        $.ajax({
            url: `https://pokeapi.co/api/v2/pokemon/${val}`,
            type: "GET",
            success: process_pokemon
        })
    } else if (key == "habitat") {
        $.ajax({
            url: `https://pokeapi.co/api/v2/pokemon-habitat/${val}`,
            type: "GET",
            success: get_pokemon
        })
    } else if (key == "type") {
        $.ajax({
            url: `https://pokeapi.co/api/v2/type/${val}`,
            type: "GET",
            success: get_pokemon_one_type
        })
    } else {
        $.ajax({
            url: `https://pokeapi.co/api/v2/pokedex/${val}`,
            type: "GET",
            success: process_dex
        })
    }
}

    function remove_history_tag() {
        $(this).parent().remove();
    }

    function setup() {
        //get_pokemons_habitat();
        $("button").click(get_pokemons);
        $("#filter").on("change", display_options);
        $('#habitat').on('change', get_pokemons_habitat);
        $('#type').on('change', get_pokemons_type);
        //$('#region').on('change', get_pokemons_region);
        $("body").on("click", ".pokemon_name", save_to_storage);
        $("body").on("click", ".retrieve_history", retrieve_history);
        $("body").on("click", ".remove_history_tag", remove_history_tag);
        $("body").on("click", ".add", add_to_cart);
    }

    $(document).ready(setup);