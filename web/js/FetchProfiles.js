class FetchProfiles{
    constructor() {
        this.profiles = [];
        this.own_profile = []
    }

    get_user_metrics(){
        fetch('/api/fetch_user_metrics', {
            method: "POST",
            headers: {"Content-type": "application/json; charset=UTF-8"}
        }).then(response => response.json()) .then(json => {
            json = json[0]
            for (let i=0; i<8; i++){
                this.own_profile.push(json["metric_"+i+1]);
            }
        });
    }

    fetch_profiles_list(){
        fetch('/api/fetch_profiles', {
            method: "POST",
            headers: {"Content-type": "application/json; charset=UTF-8"}
        }).then(response => response.json()) .then(json => {
            for (let i in json){
                this.profiles.push(
                    {"id":json[i]["id"],
                        0:json[i]["metric_1"],
                        1:json[i]["metric_2"],
                        2:json[i]["metric_3"],
                        3:json[i]["metric_4"],
                        4:json[i]["metric_5"],
                        6:json[i]["metric_6"],
                        7:json[i]["metric_7"],
                        8:json[i]["metric_8"],
                        "average":null
                    }
                )
            }
        });
    }

    sort_profiles(){
        //need to calculate average
        for (let i in this.profiles){
            let profile = this.profiles[i];
            let total = 0;
            for (let j=0; j<8; j++){
                total += Math.abs(this.own_profile[j] - profile[i]);
            }
            let average = total/8
            this.profiles[i]["average"] = average;
        }
        this.profiles.sort(function(a, b){
           return a.average - b.average;
        });
    }

    select_profile(profile_id){
        fetch('/api/fetch_profile', {
            method: "POST",
            body: JSON.stringify({"profile_id":profile_id}),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        }).then(response => response.json()) .then(json => {
            console.log(json);
            $("#profileImage").attr("src", "./profiles/"+json[0]["filename"]+json[0]["extension"]);
            $("#name").text(json[0]["full_name"]);
            $("#bio").text(json[0]["bio"]);
            $("#snap").text(json[0]["snapchat_handle"]);
        });

    }
}

$(document).ready(function(){
    let display_profile = new FetchProfiles();
    //display_profile.get_user_metrics();
    //display_profile.fetch_profiles_list();
    //display_profile.sort_profiles();
    //display_profile.select_profile(display_profile.profiles[0]["id"]);
    display_profile.select_profile(3);
});