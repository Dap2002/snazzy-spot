class FetchMatches{
    fetch_matches(){
        fetch('/api/fetch_matches', {
            method: "POST",
            headers: {"Content-type": "application/json; charset=UTF-8"}
        }).then(response => response.json()) .then(json => {
            console.log(json);
            for(let i=0; i<json.length; i++) {
                $("#matches_list").append(`<div id=div` + i + ` class='match_div'><div class="row"><div class="col-md-2"><img src="./profiles/` + json[i]["filename"] + json[i]["extension"] + `"></div><div class="col-md-2"><h2>` + json[i]['full_name'] + `</h2></div></div><div id=`+i+` class="hidden"><p>` + json[i]['bio'] + `</p><button id=snap`+i+`>Add on Snapchat</button></div></div>`);

                $("#snap"+i).click(function(){
                    fetch('/api/fetch_snap', {
                        method: "POST",
                        body: JSON.stringify({"snap":json[i]["snapchat_handle"]}),
                        headers: {"Content-type": "application/json; charset=UTF-8"}
                    }).then(response => response.json()) .then(json => {
                        let svg = json["svg"];
                        $("#matches").css("display", "none");
                        $("body").append("<div id='snap_code' class='profilecard'><div class='snapDiv'>"+svg+"</div><button id='returnBtn'>Return</button></div>");
                        $("#returnBtn").click(function(){
                           $("#matches").css("display", "block");
                           $("#snap_code").remove();
                        });
                    });

                });

                $("#div" + i).click(function () {
                    if ($("#" + i).css("display") == "none") {
                        $("#" + i).css("display", "block");
                    } else {
                        $("#" + i).css("display", "none");
                    }
                });
            }
        });
    }

}

$(document).ready(function(){
   let matches = new FetchMatches();
   matches.fetch_matches();
});