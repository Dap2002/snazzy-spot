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


