type question = {
    id:number;
    label:string;
};
type diagnosis = {
    text:string;
    should_stop:boolean;
};
type conclusion = {
    condition:string;
    probability:string;  
};
context {
    // prefine property for assign value to object 
    input endpoint: string;
    questions:question[] = [];
    diagnosis:diagnosis = {text:"",should_stop:false};
    conclusions:conclusion[] = [];
}
//TODO: Every message Dasha said and User response have to be sent to front-end by websocket 

// declare external functions here 
external function confirm(fruit: string): boolean;
external function status(): string;

//giving back list of symptom and Id according to the parse
external function parse(): string;

// keep track of user's symptom
external function trackCondition(condition:string): string;

// send text through websocket to front-end
external function sendText(ct:string,speaker:number): string; //0 mean dasha 1 mean user

// diagnosis by user's symptom
external function diagnosis():diagnosis;

// answer the follow up question 
external function answer(): question[];

// return the choice of the follow up question
external function answer_diagnosis(choice:string): string;

// conclusion about the possible disease
external function conclusion():conclusion[];

// set gender 
external function set_gender(gender:string): string;

// set age
external function set_age(age:string): string;


//TODO: 
// - How to deal with random word ?
start node root {
    do {
        #connectSafe($endpoint);
        #waitForSpeech(1000);
        external sendText("Hi,I am your symptom checker Dasha,what can I help you today? Could you please tell me your gender first?",0);
        #sayText("Hi,I am your symptom checker Dasha,what can I help you today?");
        #sayText("Could you please tell me your gender first?");
        // #sayText("Could you please describe what is your illness today?");
        wait *;
    }
    transitions {
        gender: goto gender on #messageHasData("gender");
        // parse: goto parse on true;
    }
}
node gender{
    do{
        var text = #getMessageText();
        external sendText(text,1);
        var gender = #messageGetData("gender", { value: true })[0]?.value??"";
        external set_gender(gender);
        external sendText(gender,3);
        external sendText("Great,can you let me know your age next ? This will make our diagnosis more precise!",0);
        #sayText("Great,can you let me know your age next ?");
        #sayText("This will make our diagnosis more precise!");
        wait *;
    }
    transitions{
        symptoms: goto symptoms on #messageHasData("age");
    }
}
node symptoms{
    do{
       var text = #getMessageText();
       external sendText(text,1);
       var age = #messageGetData("age", { value: true })[0]?.value??"";
       external sendText(age,4); //4 stand for age
       external set_age(age);
       external sendText("Nice,now I know you more! Could you let me know about what you feel today?",0);
       #sayText("Nice,now I know you more!");
       #sayText("Could you let me know about what you feel today?");
       wait *;
    }transitions{
        parse: goto parse on true;
    }
}



node parse{
    do{
        var text = #getMessageText();
        external sendText(text,1);
        var res = external trackCondition(text);
        //Ask if user has any symptom else?
        external sendText("Anything you wanna add up ?",0);
        #say("parse");
        wait *;
        // exit;
    }
    transitions
    {
        //if have then go to parse again 
        //else summarize the condition
        parseAllCondition: goto parseAllCondition on #messageHasIntent("no");
        parse : goto parse  on true;
    }
}

node parseAllCondition{
    do{
        var text = #getMessageText();
        external sendText(text,1);
        external sendText("I can see you have the following problem",0);
        #sayText("I can see you have the following problem");
        #waitForSpeech(1000);
        var res = external parse();
        if(res == ""){
            external sendText("Look like you are really healthy",0);
            #sayText("Look like you are really healthy");
            goto bye_then;
        }
        else{
            external sendText(res,0);
            #sayText(res);
            goto start_diagnosis;
        }
    }
    transitions{
        bye_then: goto bye_then;
        start_diagnosis: goto start_diagnosis;
    }
}

node start_diagnosis{
    do{
        external sendText("Let me start diagnosis the possible disease you might have!This might invlove a few questions for you to answer.",0);
        #sayText("Let me start diagnosis the possible disease you might have!");
        #sayText("This might invlove a few questions for you to answer.");
        #waitForSpeech(3000);
        set $diagnosis = external diagnosis();
        if($diagnosis.should_stop == true){
            external sendText("I think I have a conclusion about your symptoms",0);
            #sayText("I think I have a conclusion about your symptoms");
            goto conclusion;
        }else{
            external sendText($diagnosis.text,0);
            #sayText($diagnosis.text);
            goto alert;
        }
    }
    transitions{
        alert: goto alert;
        conclusion: goto conclusion;
    }
}
node alert{
    do{
        set $questions = external answer();
        external sendText("Please answer Yes,No,or don't know if the following conditions suits you",0);
        #sayText("Please answer Yes,No,or don't know if the following conditions suits you");
        wait *;
    }
    transitions{
        repeat: goto repeat_diagnosis on #messageHasData("answer");
    }
}
node start_answer{
    do{ 
        set $questions = external answer();
        wait *;
    }
    transitions{
        repeat: goto repeat_diagnosis on #messageHasData("answer"); //yes,no,don't know
    }
}

node repeat_diagnosis{
    do{
        var text = #getMessageText();
        external sendText(text,1);
        var choice = #messageGetData("answer", { value: true })[0]?.value??"";
        #log(choice);
        external sendText("your choice is " + choice,0);
        #sayText("your choice is " + choice);
        if(choice=="yes"){
            external answer_diagnosis("0");
        }else if(choice=="no"){
            external answer_diagnosis("1");
        }else{
            external answer_diagnosis("2");
        }   
        //TODO: Change to parse
        external sendText("That's great,let's go with another question!",0);
        #say("followup");
        set $diagnosis = external diagnosis();
        if($diagnosis.should_stop == true){
            external sendText("I think I have a conclusion about your symptoms",0);
            #sayText("I think I have a conclusion about your symptoms");
            goto conclusion;
        }else{
            external sendText($diagnosis.text,0);
            #sayText($diagnosis.text);
            goto answer;
        }
    }
    transitions{
        answer: goto start_answer;
        conclusion: goto conclusion;
    }
}

node conclusion{
    do{
        external sendText("I think I know what you might be having",0);
        #sayText("I think I know what you might be having");
        set $conclusions = external conclusion();
        for (var c in $conclusions){
            // external sendText(c.condition +" with " + c.probability + " of probability!",0);
            external sendText(c.condition +"with" + c.probability,5);
            // #sayText(c.condition +" with " + c.probability + " of probability!");
        }
        external sendText("Let me take you to the result page in a sec!",0);
        #sayText("Let me take you to the result page in a sec!");
        external sendText("end",6);
        exit;
    }
    transitions{
        repeat: goto root on #messageHasIntent("yes");
        bye_then: goto bye_then on #messageHasIntent("no");

    }
}

node bye_then {
    do {
        var text = #getMessageText();
        external sendText(text,1);
        external sendText("Thank you and happy trails! ",0);
        external sendText("end",6);
        #sayText("Thank you and happy trails! ");
        exit;
    }
}


digression bye  {
    conditions { on #messageHasIntent("bye"); }
    do {
        external sendText("Let me take you to the result page in a sec!",0);
        #sayText("Let me take you to the result page in a sec!");
        exit;
    }
}




// additional digressions 
digression @wait {
    conditions { on #messageHasAnyIntent(digression.@wait.triggers)  priority 900; }
    var triggers = ["wait", "wait_for_another_person"];
    var responses: Phrases[] = ["i_will_wait"];
    do {
        for (var item in digression.@wait.responses) {
            #say(item, repeatMode: "ignore");
        }
        #waitingMode(duration: 70000);
        return;
    }
    transitions {
    }
}

digression repeat {
    conditions { on #messageHasIntent("repeat"); }
    do {
        #repeat();
        return;
    }
} 
