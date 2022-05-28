function create_account() {
    $("#error").remove()
    if (!$("#firstname").val() || !$("#lastname").val() || !$("#email").val() || !$("#password").val()) {
        $("#form").append('<p id="error">Please enter all the required field</p>')
    } else {
        $.post('https://fathomless-forest-63849.herokuapp.com/register',
            {
                first: $("#firstname").val(),
                last: $("#lastname").val(),
                email: $("#email").val(),
                password: $("#password").val(),
                title: 'regular'
            },
            (message) => {
                console.log(message)
                if(message == 'exist'){
                    $("#form").append('<p id="error">Email already exists. Please login if you are current user.</p>')
                }else if(message == "success"){
                    window.location.href = "login.html"
                }
            })
    }
}

function setup() {
    $("button").click(create_account)
}

$(document).ready(setup)