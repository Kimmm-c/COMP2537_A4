function fetch_user() {
    $.get('/get_user', (user) => {
        //console.log(user)
        $("#info").append(`First name: ${user.first}<br>
        Last name: ${user.last}<br>
        Contact: ${user.email}<br>
        Items in cart: ${user.shoppingCart.length}`)
        for (count = 0; count < user.timeline.length; count++) {
            // console.log(user.timeline[count])
            $("#timeline_display").append(`<div data='${user.timeline[count].time}'>
        ${user.timeline[count].time}: ${user.timeline[count].activity}<br>
        <button class="like">${user.timeline[count].hits} Likes</button><button class="delete">Delete timeline</button></div><hr>`)
            // $("#timeline_display").append(``)
        }

    })
}

function delete_timeline(){
    //console.log($(this).parent().attr("id"));
    $.ajax({
        url: `/delete_timeline/${$(this).parent().attr("data")}`,
        type: "put",
        success: (message) => {
            console.log(message)
            location.reload()
        }
    })
}

function update_likes(){
    //console.log($(this).parent().attr("id"));
    $.ajax({
        url: `/update_likes/${$(this).parent().attr("data")}`,
        type: "put",
        success: location.reload()
    })
}

function setup() {
    fetch_user();
    $("body").on("click", ".delete", delete_timeline);
    $("body").on("click", ".like", update_likes);
}

$(document).ready(setup)