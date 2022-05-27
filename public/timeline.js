function get_timelines(){
    $.ajax({
        url: `http://localhost:5000/get_all_timeline`,
        type: "get",
        success: process_timelines
    })
}

function process_timelines(timelines){
    //console.log(timelines);
    for(count = 0; count < timelines.length; count++){
        $("#timeline_display").append(`<div id=${timelines[count]["_id"]}>
        ${timelines[count].time}: ${timelines[count].activity}<br>
        <button class="like">${timelines[count].hits} Likes</button><button class="delete">Delete timeline</button></div><hr>`)
    }
}

function delete_timeline(){
    //console.log($(this).parent().attr("id"));
    $.ajax({
        url: `/delete_timeline/${$(this).parent().attr("id")}`,
        type: "delete",
        success: location.reload()
    })
}

function update_likes(){
    //console.log($(this).parent().attr("id"));
    $.ajax({
        url: `/update_likes/${$(this).parent().attr("id")}`,
        type: "put",
        success: location.reload()
    })
}

function setup(){
    get_timelines();
    $("body").on("click", ".delete", delete_timeline);
    $("body").on("click", ".like", update_likes);
}

$(document).ready(setup);