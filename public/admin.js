
function fetch_users() {
    $.get('/get_all_users', (users) => {
        //console.log(users);
        // table = `<table>
        // <tr>
        //   <th>Users</th>
        //   <th>Actions</th>
        // </tr>`
        for (count = 0; count < users.length; count++) {
            if (users[count].title == "admin") {
                //     table += `<tr>
                //     <td>Name: ${users[count].first} ${users[count].last}<br>
                //     Email: ${users[count].email}<br>
                //     Items in cart: ${users[count].shoppingCart.length}<br>
                //     Pending amount: ${users[count].price}<br>
                //     Title: ${users[count].title}</td>
                //     <td><button class='edit' id=${users[count]['_id']}>Edit</button></td>
                //   </tr>`
                $("#users_display").append(`<div>
                Name: ${users[count].first} ${users[count].last}<br>
                Email: ${users[count].email}<br>
                Items in cart: ${users[count].shoppingCart.length}<br>
                Pending amount: ${users[count].price}<br>
                Title: ${users[count].title}<br>
                <button class='edit' id=${users[count]['_id']}>Edit</button></div><hr>`);
            } else {
                //     table += `<tr>
                //     <td>Name: ${users[count].first} ${users[count].last}<br>
                //     Email: ${users[count].email}<br>
                //     Items in cart: ${users[count].shoppingCart.length}<br>
                //     Pending amount: ${users[count].price}<br>
                //     Title: ${users[count].title}</td>
                //     <td><button class='edit' id=${users[count]['_id']}>Edit</button> <button class='delete' data=${users[count]['_id']}>Delete</button> </td>
                //   </tr>`
                $("#users_display").append(`<div>
                Name: ${users[count].first} ${users[count].last}<br>
                Email: ${users[count].email}<br>
                Items in cart: ${users[count].shoppingCart.length}<br>
                Pending amount: ${users[count].price}<br>
                Title: ${users[count].title}<br>
                <button class='edit' id=${users[count]['_id']}>Edit</button> <button class='delete' data=${users[count]['_id']}>Delete</button></div><hr>`);
            }
        }
        // table += `</table>`
        // $("#users_display").append(table);
    })
}

function delete_user() {
    $.ajax({
        url: `/delete_user`,
        type: 'delete',
        data: {
            id: $(this).attr("data")
        },
        success: (message) => {
            location.reload();
        }
    })
}

function toggle_form() {
    $("#edit_log").css("display", "none");
    if ($("#add_form").css("display") == "none") {
        $("#add_form").css("display", '');
    } else {
        $("#add_form").css("display", 'none');
    }
}

function add_user() {

    //console.log($("#first").val(), $("#lastname").val(), $("#email").val())
    if (!$("#first").val() || !$("#lastname").val() || !$("#email").val() || !$("#password").val()) {
        //console.log('missing field')
        $("#error_radio").css("display", 'none');
        $("#error_exist").css("display", 'none');
        $("#error_input").css("display", '');
    } else if (!$("input[name='user_type']:checked").val()) {
        //console.log('choose type')
        $("#error_radio").css("display", '');
        $("#error_input").css("display", 'none');
        $("#error_exist").css("display", 'none');
    } else {
        //console.log($('input[name="user_type"]:checked').val())
        $.post('/register',
            {
                first: $("#first").val(),
                last: $("#lastname").val(),
                email: $("#email").val(),
                password: $("#password").val(),
                title: $('input[name="user_type"]:checked').val()
            },
            (message) => {
                if (message == 'exist') {
                    $("#error_exist").css('display', '');
                    $("#error_radio").css("display", 'none');
                    $("#error_input").css("display", 'none');
                } else if (message == "success") {
                    location.reload();
                }
            })
    }
}

function display_edit_log() {
    $("#add_form").css("display", "none");
    $("#edit_log").css("display", "");
    $("#submit_edit").attr("data", `${$(this).attr("id")}`)
}

function update_user() {
    if (!$("#new_first").val() || !$("#new_lastname").val()) {
        //console.log('missing field')
        $("#missing_input").css("display", "")
    } else {
        $.ajax({
            url: `/edit_user`,
            type: 'put',
            data: {
                id: $("#submit_edit").attr("data"),
                first: $("#new_first").val(),
                last: $("#new_lastname").val()
            },
            success: (message) => {
                // console.log(message)
                location.reload();
            }
        })
    }
}

function setup() {
    fetch_users();
    $('body').on('click', '.delete', delete_user);
    $('body').on('click', '.edit', display_edit_log);
    $("#add_user").click(toggle_form);
    $("#submit_user").click(add_user);
    $("#cancel").click(() => {
        $("#edit_log").css("display", "none");
    })
    $("#submit_edit").click(update_user)
}

$(document).ready(setup);