$(document).ready(() => {
loadGroups()
})

function createGroup() {
    fetch('/api/group/create', {
        method: "POST",
        body: JSON.stringify({name: $("#name").val(), description: $("#description").val()}),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    }).then(response => response.json()).then(json => {
        if (json.success) {
            window.location.reload();
        }
    });
}

function joinGroup() {
    fetch('/api/group/join', {
        method: "POST",
        body: JSON.stringify({id: $("#id").val(), password: $("#password").val()}),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    }).then(response => response.json()).then(json => {
        console.log(json)
    });
}

function loadGroups() {
    fetch('/api/group/load', {
        method: "GET",
    }).then(response => response.json()).then(json => {
        for (let i = 0; i < json.length; i++) {
            $("#accordion").append(`<h3>${json[i].group_name}</h3><ul><p>
            <strong>Group ID:</strong>${json[i].group_id} <br/><strong>Group password:</strong>${json[i].group_passcode}<br/> ${json[i].group_description}<br />
            <button onclick="showPeople(${json[i].group_id})">Show members</button>
            <ul class="members" style="display:none" data-group="${json[i].group_id}"></ul></p>
            </div>`);
        }
        $('#accordion').accordion()

    });

}


function showPeople(id) {
    $(`.members[data-group = ${id}]`).html(null);
    $(`.members[data-group = ${id}]`).toggle();
    fetch('/api/group/people', {
        method: "POST",
        body: JSON.stringify({id}),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    }).then(response => response.json()).then(json => {
        console.log(json)
        for (let i = 0; i < json.length; i++) {
            $(`.members[data-group = ${id}]`).append(`<li>${json[i].full_name}&nbsp;<a href="#" onclick="loadSnapchat('${json[i].snapchat_handle}')">Show snapchat</a>
                <div style="display: none" data-snapcode="${json[i].snapchat_handle}" class="snapcode"></div></li>`)
        }
    });
}


function loadSnapchat(snap) {
    fetch('/api/fetch_snap', {
        method: "POST",
        body: JSON.stringify({snap}),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    }).then(response => response.json()).then(json => {
        let svg = json["svg"];
        $(`.snapcode[data-snapcode='${snap}']`).html(svg).show()
    });
    return false;
}
