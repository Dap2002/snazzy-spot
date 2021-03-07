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
            if (json.success) {
                $(".register").html(`<h1> All registered!</h1><span>Go <a href="/signin.html">login</a></span>`)
            } else {
                let err_msg = json["errors"][0];
                console.log(err_msg);
                $("#errMsg").text("Error " +err_msg);
            }
        });
    }

}

$(document).ready(function(){
    login((user)=>{
        if(user.logged_in){
            $(".register").html("<h1>Already logged in!</h1>")
        }
    })
    let new_user = new Registration();
    $("#submitBtn").click(function(){
        new_user.register_user();
    });
});
