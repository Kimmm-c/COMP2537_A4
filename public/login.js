function process_auth() {
    $.post(`/login`,
        {
            email: $("#email").val(),
            password: $("#password").val()
        },
        (user) => {
            if (user == "fail") {
                location.reload();
            } else {
                console.log(user)
                if (user.title == "admin") {
                    // console.log('admin')
                    window.location.href = "admin.html"
                } else {
                    window.location.href = "user_profile.html"
                }
            }
        })
}

function setup() {
    $("button").click(process_auth);
}

$(document).ready(setup);