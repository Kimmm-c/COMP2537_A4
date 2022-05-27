cart = null
price = null


function fetch_cart() {
    $("#pokemons_display").empty();
    $("#payment").empty();
    $.get('/get_cart', (user) => {
        //console.log(user)
        cart = user[0].shoppingCart
        price = user[0].price
        display_cart(user[0].shoppingCart)
        $("#payment").append(`<div class="checkout">Before tax: ${user[0].price}<br>
            Tax: ${Math.round(user[0].price * 0.12 *100)/100}<br>
            Total: ${Math.round(user[0].price * 1.12 * 100) / 100}<br></div>`)
    })
}

function display_cart(cart) {
    //console.log(cart)
    $("#pokemons_display").empty();
    $("#history").css({"font-weight": "normal", "text-decoration": "none"})
    $("#cart").css({"font-weight": "bold", "text-decoration": "underline"})
    for (count = 0; count < cart.length; count++) {
        $.get(`https://pokeapi.co/api/v2/pokemon/${cart[count]}`, (pokemon) => {
            $("#pokemons_display").append(`<div class='pokemon' id=${pokemon.id}>
            <div class="image">
            <img src=${pokemon.sprites.other["official-artwork"]["front_default"]}>
            </div>
            <div class="info">${pokemon.id}<br>
            ${pokemon.name}<br>
            <button class="remove" data=${pokemon.name} price=${pokemon.id}>Remove</button></div></div>`)
        })
    }
}

function check_out() {
    //console.log(cart)
    //console.log(price)
    $.post('/checkout', {
        cart: cart,
        price: price
    },
        (message) => {
            console.log(message)
            insert_timeline();
            location.reload();
        })
}

function insert_timeline() {
    now = new Date(Date.now());
    formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    $.post('/add_timeline',
        {
            activity: `You purchased ${cart} for $${price}`,
            hits: 0,
            time: now
        },
        (message) => {
            console.log(message)
        }
    )
}

function display_history() {
    $("#pokemons_display").empty();
    $("#cart").css({"font-weight": "normal", "text-decoration": "none"})
    $("#history").css({"font-weight": "bold", "text-decoration": "underline"})
    $.get('/get_order_history', (history) => {
        //console.log(history);
        for (count = 0; count < history.length; count++) {
            $("#pokemons_display").append(`<div class="ordered"><h5>Order #${count}</h5>
            Purchase of: ${history[count].cart}<br>
            Before tax: ${history[count].price}<br>
            Taxes: ${Math.round(history[count].price * 0.12 *100) / 100}<br>
            Total: ${Math.round(history[count].price * 1.12 * 100) / 100}
            </div><hr>`)
        }
    })
}

function remove_item(){
    // console.log($(this).attr("price"));
    $.ajax({
        url: `/remove_item/${$(this).attr("data")}/${$(this).attr("price")}`,
        type: "delete",
        success: (message) => {
            console.log(message)
            location.reload()
        }
    })
}

function setup() {
    fetch_cart();
    $("#checkout").click(check_out);
    $("#history").click(display_history);
    $("#cart").click(fetch_cart);
    $("body").on("click", ".remove", remove_item);
}

$(document).ready(setup)