class Registration{
    register_user(){
        this.user_details = {
            "full_name": $("#fullName").val(),
            "email": $("#email").val(),
            "password":$("#password").val(),
            "bio":$("#bio").val(),
            "snapchat":$("#snapchat").val()
        };
        console.log(this.user_details);
        fetch('/', {
            method: "POST",
            body: JSON.stringify(this.user_details),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        }).then(response => response.json()) .then(json => {
            console.log(json);
        });
    }

}

$(document).ready(function(){
    let new_user = new Registration();
    $("#submitBtn").click(function(){
       new_user.register_user();
    });
});
