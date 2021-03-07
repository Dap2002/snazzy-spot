class FetchMatches {
    constructor() {
        this.group = "";
    }

    fetch_matches() {
        fetch('/api/fetch_matches', {
            method: "POST",
            headers: {"Content-type": "application/json; charset=UTF-8"}
        }).then(response => response.json()).then(json => {
            console.log(json);
            for (let i = 0; i < json.length; i++) {
                $("#matches_list").append(`<div id='div` + i + `' class='match_div'><div onclick="$('#`+i+`').show()" class="row"><div><img src="./profiles/` + json[i]["filename"] + json[i]["extension"] + `"></div><div><h2>` + json[i]['full_name'] + `</h2></div></div><div id=` + i + ` class="hidden"><p>` + json[i]['bio'] + `</p>${this.group}<button onclick="addToGroup($('#`+i+` .select_group').val())">Add to group</button><button id='snap` + i + `'>Add on Snapchat</button><button onclick="$('#`+i+`').hide()">Hide</button></div></div>`);

                $("#snap" + i).click(function () {
                    fetch('/api/fetch_snap', {
                        method: "POST",
                        body: JSON.stringify({"snap": json[i]["snapchat_handle"]}),
                        headers: {"Content-type": "application/json; charset=UTF-8"}
                    }).then(response => response.json()).then(json => {
                        let svg = json["svg"];
                        $("#matches").css("display", "none");
                        $("body").append("<div id='snap_code' class='profilecard'><div class='snapDiv'>" + svg + "</div><button id='returnBtn'>Return</button></div>");
                        $("#returnBtn").click(function () {
                            $("#matches").css("display", "block");
                            $("#snap_code").remove();
                        });
                    });

                });

            }
        });
    }

    fetch_groups() {
        fetch('/api/group/load', {
            method: "GET",
        }).then(response => response.json()).then(json => {
            this.group = `<select class='select_group'>`
            for (let i = 0; i < json.length; i++) {
                this.group += `<option value='${json[i].group_id}'>${json[i].group_name}</option>`
            }
            this.group += `</select>`
            this.fetch_matches();
        });

    }

}
function addToGroup(id){
    fetch('/api/group/add', {
        method: "POST",
        body: JSON.stringify({group_id: id}),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    }).then(response => response.json()).then(json => {
        window.location.href='groups.html';
    });}
$(document).ready(function(){
   let matches = new FetchMatches();
   matches.fetch_groups();
});
