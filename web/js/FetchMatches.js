class FetchMatches{
    fetch_matches(){
        fetch('/api/fetch_matches', {
            method: "POST",
            headers: {"Content-type": "application/json; charset=UTF-8"}
        }).then(response => response.json()) .then(json => {
            console.log(json);
        });
    }
}

$(document).ready(function(){
   let matches = new FetchMatches();
   matches.fetch_matches();
});