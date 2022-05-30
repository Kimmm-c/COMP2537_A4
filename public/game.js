table = ``
firstCard = undefined
secondCard = undefined
firstCardHasBeenFlipped = false
time = null;
dimension = null
match_count = null
start_countdown = null


function display_options() {
    select = document.getElementById("grid");
    grid = select.options[select.selectedIndex].value;
    //console.log(grid);
    if (grid == '22') {
        $("#poke_num").empty();
        $("#poke_num").append(`<label for="pokemon_num">Number of pokemons</label><br>
        <select name="pokemon_num" id="pokemon_num">
            <option value="2" >2</option>
            </select>`)
    } else if (grid == '43') {
        $("#poke_num").empty();
        $("#poke_num").append(`<label for="pokemon_num">Number of pokemons</label><br>
        <select name="pokemon_num" id="pokemon_num">
            <option value="2" >2</option>
            <option value="6">6</option>
        </select>`)
    } else if (grid == '64') {
        $("#poke_num").empty();
        $("#poke_num").append(`<label for="pokemon_num">Number of pokemons</label><br>
        <select name="pokemon_num" id="pokemon_num">
            <option value="2" >2</option>
            <option value="6">6</option>
            <option value="12">12</option>
        </select>`)
    } else {
        $("#poke_num").empty();
    }
}

async function game_setup() {
    select = document.getElementById("grid");
    grid = select.options[select.selectedIndex].value;
    // console.log(grid);
    if (grid == "default") {
        $("#missing_dimension").remove();
        $("#game_setup").append(`<p id="missing_dimension">Please choose a dimension</p>`)
    } else {
        $("#pokemons_display").empty();
        $("#missing_dimension").remove();
        $("#game_setup").css("display", "none");

        dimension = grid;

        select2 = document.getElementById("pokemon_num");
        poke_num = select2.options[select2.selectedIndex].value;

        console.log(grid, difficulty, poke_num)
        poke_list = [];
        for (count = 0; count < poke_num; count++) {
            await $.get(`https://pokeapi.co/api/v2/pokemon/${Math.round(Math.random() * (900 - 1) + 1)}`, (pokemon) => {
                //console.log(pokemon);
                poke_list.push(pokemon)
            })
        }
        console.log(poke_list)
        table = ``
        //console.log(grid[0] * grid[1])
        id = 1
        for (count = 0; count < poke_num; count++) {
            //console.log(poke_list[count].sprites.other["official-artwork"]["front_default"])
            for (count2 = 0; count2 < grid[0] * grid[1] / poke_num; count2++) {
                table += `<div class="cards">
        <img class="front" id=${id} src=${poke_list[count].sprites.other["official-artwork"]["front_default"]}>
        <img class="back" src="./pokeball.png">
        </div>`
                id++
            }
        }
        $("#pokemons_display").append(table);
        shuffle_divs();
        $(".cards").css("width", `calc(${(100 / grid[0])}% - 10px)`)
        $("#timer").css("display", "");
        $("#game_events").css("display", "");
        set_timer();
    }
}

function shuffle_divs() {
    parent = $("#pokemons_display");
    divs = parent.children();
    while (divs.length) {
        parent.append(divs.splice(Math.floor(Math.random() * divs.length), 1)[0]);
    }
}

function set_timer() {
    select1 = document.getElementById("difficulty");
    difficulty = select1.options[select1.selectedIndex].value;
    // console.log(difficulty);
    if (difficulty == "easy") {
        time = 5 * 60
    } else if (difficulty == "medium") {
        time = 3 * 60
    } else {
        time = 0.25 * 60
    }
    start_countdown = setInterval(countdown, 1000);
}

function countdown() {
    if (time >= 0 && match_count != dimension[0] * dimension[1]) {
        minute = Math.floor(time / 60);
        second = time % 60;
        second = second < 10 ? '0' + second : second;
        $("#timer").text(`${minute}:${second}`);
        time--
    } else {
        if (match_count == dimension[0] * dimension[1]) {
            //console.log('win')
            insert_timeline('won')
            $("#game_board").remove();
            $("#message").append(`<p style="color: green">You win!</p>
            <button class="reset">Play another game</button>`)
        } else {
            //console.log('lose')
            insert_timeline('lost')
            $("#game_board").remove();
            $("#message").append(`<p style="color: red">You lose..</p>
            <button class="reset">Play another game</button>`)
        }
        clearInterval(start_countdown)
    }
}

function flip_card() {
    $(this).toggleClass("flip")

    if (!firstCardHasBeenFlipped) {
        // the first card
        firstCard = $(this).find(".front")[0]
        // console.log(firstCard);
        firstCardHasBeenFlipped = true
        $(`#${firstCard.id}`).click(false);
    } else {
        // this is the 2nd card
        secondCard = $(this).find(".front")[0]
        firstCardHasBeenFlipped = false
        // console.log(firstCard, secondCard);
        // ccheck if we have match!
        
       
        $(".cards").prop("disabled", true);
        setTimeout(()=>{
            $(".cards").prop("disabled", false);
        }, 1500)
        
        if (
            $(`#${firstCard.id}`).attr("src") == $(`#${secondCard.id}`).attr("src")) {
            // console.log("a match!");
            // update the game state
            // disable clicking events on these cards
            $("#game_events").append(`<p>(${gettime()}): Found a match!</p>`)
            $(`#${firstCard.id}`).click(false)
            $(`#${secondCard.id}`).click(false)

            match_count += 2
        } else {
            // console.log("not a match");
            // unflipping
            $("#game_events").append(`<p>(${gettime()}): Not a match!</p>`)
            setTimeout(() => {
                $(`#${firstCard.id}`).parent().removeClass("flip")
                $(`#${secondCard.id}`).parent().removeClass("flip")
            }, 1000)
        }
    }
}

function insert_timeline(filter) {
    now = new Date(Date.now());
    formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    console.log(filter);
    $.ajax({
        url: `/add_timeline`,
        type: "post",
        data: {
            activity: `You ${filter} the Pokemon matching game!`,
            hits: 0,
            time: now
        }
    })
}

function gettime(){
    now = new Date(Date.now());
    formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    return formatted
}

function setup() {
    $("#grid").on("change", display_options);
    $("#start_game").click(game_setup);
    $("body").on("click", '.cards', flip_card)
    $("body").on("click", '.reset', () => {
        location.reload();
    })
}

$(document).ready(setup);