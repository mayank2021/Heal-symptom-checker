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


//TODO: 
// - How to deal with random word ?
start node root {
    do {
        #connectSafe($endpoint);
        #waitForSpeech(1000);
        #sayText("Hi,I am your symptom checker Dasha,what can I help you today?");
        #sayText("Could you please describe what is your illness today?");
        external sendText("Hi,I am your symptom checker Dasha,what can I help you today? Could you please describe what is your illness today?",0);
        wait *;
    }
    transitions {
        parse: goto parse on true;
        // parse: goto parse on true;
    }
}

node parse{
    do{
        var text = #getMessageText();
        external sendText(text,1);
        var res = external trackCondition(text);
        //Ask if user has any symptom else?
        #say("parse");
        #log("parse");
        //TODO: Need changing
        external sendText("Anything I can add up ?",0);
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
        #sayText("I can see you have the following problem");
        external sendText("I can see you have the following problem",0);
        #waitForSpeech(1000);
        var res = external parse();
        if(res == ""){
            #sayText("Look like you are really healthy");
            external sendText("Look like you are really healthy",0);
            goto bye_then;
        }
        else{
            #sayText(res);
            external sendText(res,0);
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
        #sayText("Let me start diagnosis the possible disease you might have!");
        #sayText("This might invlove a few questions for you to answer.");
        external sendText("Let me start diagnosis the possible disease you might have!This might invlove a few questions for you to answer.",0);
        #waitForSpeech(3000);
        set $diagnosis = external diagnosis();
        if($diagnosis.should_stop == true){
            #sayText("I think I have a conclusion about your symptoms");
            external sendText("I think I have a conclusion about your symptoms",0);
            goto conclusion;
        }else{
            #sayText($diagnosis.text);
            external sendText($diagnosis.text,0);
            goto answer;
        }
    }
    transitions{
        answer: goto start_answer;
        conclusion: goto conclusion;
    }
}

node start_answer{
    do{ 
        set $questions = external answer();
        #sayText("Please answer Yes,No,or don't know if the following conditions suits you");
        external sendText("Please answer Yes,No,or don't know if the following conditions suits you",0);
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
        #sayText("your choice is " + choice);
        external sendText("your choice is " + choice,0);
        if(choice=="yes"){
            external answer_diagnosis("0");
        }else if(choice=="no"){
            external answer_diagnosis("1");
        }else{
            external answer_diagnosis("2");
        }   
        //TODO: Change to parse
        #sayText("That's great,let's go with another question!");
        external sendText("That's great,let's go with another question!",0);
        set $diagnosis = external diagnosis();
        if($diagnosis.should_stop == true){
            #sayText("I think I have a conclusion about your symptoms");
            external sendText("I think I have a conclusion about your symptoms",0);
            goto conclusion;
        }else{
            #sayText($diagnosis.text);
            external sendText($diagnosis.text,0);
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
        #sayText("I think you might be having");
        external sendText("I think you might be having",0);
        set $conclusions = external conclusion();
        for (var c in $conclusions){
            #sayText(c.condition +" with " + c.probability + " of probability!");
            external sendText(c.condition +" with " + c.probability + " of probability!",0);
        }
        #sayText("Is their anything I can help with you?");
        external sendText("Is their anything I can help with you?",0);
        wait *;
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
        #sayText("Thank you and happy trails! ");
        external sendText("Thank you and happy trails! ",0);
        exit;
    }
}


digression bye  {
    conditions { on #messageHasIntent("bye"); }
    do {
        #sayText("Thank you and happy trails! ");
        external sendText("Thank you and happy trails! ",0);
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
