/**
 * Script to include on each browser page
 * Manages account details
 **/
function login(callback=()=>{return false}) {
    fetch('/api/status', {
        method: "GET",
        headers: {"Content-type": "application/json; charset=UTF-8"}
    }).then(response => response.json()).then(json => {
        if (json.logged_in) {
            $("#signin, .signin").text(json.username)
            $(".signin").html(`${json.username} <span class="fa fa-bars"></span>`)
            $("#signin").attr('href', 'profile.html')
            $("#signout").show();
        }
        callback(json)
    });
}

function signOut() {
    fetch('/api/logout', {
        method: "GET",
        headers: {"Content-type": "application/json; charset=UTF-8"}
    }).then(r => {
        window.location.reload();
    })
}

$(document).ready(function () {
    $("#signout").hide();
    $('#nav_toggle').click(() => {
        const dropdown = $(".dropdown")
        dropdown.toggleClass('down').toggleClass('gone');
    })
    login()
})
