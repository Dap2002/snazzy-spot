class Login{
    login_user(){
        this.user_details = {
            "email":$("#email").val(),
            "password":$("#password").val()
        };
        fetch('/api/login', {
            method: "POST",
            body: JSON.stringify(this.user_details),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        }).then(response => response.json()) .then(json => {
            console.log(json);
        });
    }
}


$(document).ready(function(){
    let new_user = new Login();
    $("#submitBtn").click(function(){
        new_user.login_user();
    });
});