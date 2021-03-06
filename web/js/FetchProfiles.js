class FetchProfiles{
    constructor() {
        this.profiles = [];
    }
    fetch_profiles_list(){
        fetch('/api/fetch_profiles', {
            method: "POST",
            headers: {"Content-type": "application/json; charset=UTF-8"}
        }).then(response => response.json()) .then(json => {
            console.log(json);
        });
    }
}

$(document).ready(function(){
    let display_profile = new FetchProfiles();
    display_profile.fetch_profiles_list();
});