class Quiz{
    constructor(){
        this.question_number = 0;
        this.questions = [
            {"question": "Are you a morning bird or night owl?","answer": null, "left":"Morning bird", "right":"Night owl"},
            {"question": "Are you quite serious or more of a class clown?","answer": null, "left":"Serious", "right":"Clown"},
            {"question": "Have you got an interest in sport?","answer": null, "left":"No interest", "right":"I love sports"},
            {"question": "Do you like the outdoors?","answer": null, "left":"No", "right":"Yes"},
            {"question": "Are you interested in STEM subjects?","answer": null, "left":"No", "right":"Yes"},
            {"question": "Are you interested in humanities?","answer": null, "left":"No", "right":"Yes"},
            {"question": "Are you interested in art?","answer": null, "left":"No", "right":"Yes"},
            {"question": "Would you describe yourself as introverted or extroverted?","answer": null, "left":"Introverted", "right":"Extroverted"},
        ]

    }
    collect_input(){
        this.question_number++;
        if(this.question_number < 1){
            return false;
        }
        this.questions[this.question_number-1]["answer"] = $("#answer").val();
        if(this.question_number == 8){

        }
    }
    show_question(){
        if(this.question_number >= 8) return false;
        let current_question = this.questions[this.question_number];
        $("#question").text(current_question["question"]);
        $("#left").text(current_question["left"]);
        $("#right").text(current_question["right"]);
    }

    check_status(){
        if(this.question_number == 0){
            $("#questionDiv").css("display", "block");
            $("#nextQ").text("Next");
        }
        if(this.question_number == 6){
            $("#nextQ").text("Finish test");
        }
        if(this.question_number == 7){
            alert("test completed!");
            this.upload_responses();
        }
    }

    upload_responses(){
        let responses = [];
        for (let i in this.questions){
            responses.push(this.questions[i]["answer"]);
        }
        responses = {"responses":responses};

        fetch('/api/submit_quiz', {
            method: "POST",
            body: JSON.stringify(responses),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        }).then(response => response.json()) .then(json => {
            console.log(json)

        });

    }

}

$(document).ready(function(){
    $("#questionDiv").css("display", "none");
    $("#questionTitle").text("Personality Test");
    $("#question").text("This personality test will help us to find you compatible flatmates. Finish the test to proceed to the site.");

    let quiz = new Quiz();

    $("#nextQ").click(function(){
        console.log("next question");
        quiz.check_status();
        quiz.collect_input();
        quiz.show_question();
    });

});