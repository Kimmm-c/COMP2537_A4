function process_auth(){
    $.post(`https://fathomless-forest-63849.herokuapp.com/login`,
    {
        email: $("#email").val(),
        password: $("#password").val()
    },
    (message)=>{
        if(message == "fail"){
            location.reload();
        }else{
            window.location.href = "user_profile.html"
        }
    })
}

function setup(){
    $("button").click(process_auth);
}

$(document).ready(setup);