$(document).ready(() => {
    $('#accordion').accordion()
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
        console.log(json)
        for (let i = 0; i < json.length; i++) {
            $("#accordion").append(`<h3>${json[i].group_name}</h3><div><p>
            <strong>Group ID:</strong>${json[i].group_id} <br/><strong>Group password:</strong>${json[i].group_passcode}<br/> ${json[i].group_description}<br /><button onclick="showPeople(${json[i].group_id})">Show members</button></p></div>`);
        }
        $('#accordion').accordion()

    });

}


function showPeople(id){
    fetch('/api/group/people', {
        method: "POST",
        body: JSON.stringify({id}),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    }).then(response => response.json()).then(json => {
    });
}


