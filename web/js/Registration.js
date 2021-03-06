class Registration{
    register_user(){
        this.user_details = {
            "full_name": $("#fullName").val(),
            "email": $("#email").val(),
            "password":$("#password").val(),
            "bio":$("#bio").val(),
            "snapchat":$("#snapchat").val()
        };
        fetch('/api/register', {
            method: "POST",
            body: JSON.stringify(this.user_details),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        }).then(response => response.json()) .then(json => {
            console.log(json)
            if (json.success) {
                $(".register").html(`<h1> All registered!</h1><span>Go <a href="/login.html">login</a></span>`)
            } else {
                $('.error').text(`Error: ${json.errors.code}`)

            }
        });
    }

}


$(document).ready(function(){
    let new_user = new Registration();
    $("#submitBtn").click(function(){
       new_user.register_user();
    });
});
