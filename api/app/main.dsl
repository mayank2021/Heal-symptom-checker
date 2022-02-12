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
external function sendText(ct:string): string;

// diagnosis by user's symptom
external function diagnosis():diagnosis;

// answer the follow up question 
external function answer(): question[];

// return the choice of the follow up question
external function answer_diagnosis(choice:string): string;

// conclusion about the possible disease
external function conclusion():conclusion[];

start node root {
    do {
        #connectSafe($endpoint);
        #waitForSpeech(1000);
        #sayText("Hi,I am your symptom checker,what can I help you today?");
        #sayText("Could you please describe what is your illness today?");
        external sendText("Hi,I am your symptom checker,what can I help you today?");
        // external getText("Hi,I am your symptom checker,what can I help you today?,Could you please descirbe what is your illness today?");
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
        var res = external trackCondition(text);
        //Ask if user has any symptom else?
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
        #sayText("I can see you have the following problem");
        #waitForSpeech(1000);
        var res = external parse();
        if(res == ""){
            #sayText("Look like you are really healthy");
            goto bye_then;
        }
        else{
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
        #sayText("Let me start diagnosis the possible disease you might have!");
        #sayText("This might invlove a few questions for you to answer.");
        #waitForSpeech(3000);
        set $diagnosis = external diagnosis();
        if($diagnosis.should_stop == true){
            #sayText("I think I have a conclusion about your symptoms");
            goto conclusion;
        }else{
            #sayText($diagnosis.text);
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
        wait *;
    }
    transitions{
        repeat: goto repeat_diagnosis on #messageHasData("answer"); //yes,no,don't know
    }
}

node repeat_diagnosis{
    do{
        var choice = #messageGetData("answer", { value: true })[0]?.value??"";
        #log(choice);
        #sayText("your choice is " + choice);
        if(choice=="yes"){
            external answer_diagnosis("0");
        }else if(choice=="no"){
            external answer_diagnosis("1");
        }else{
            external answer_diagnosis("2");
        }   
        #sayText("That's great,let's go with another question!");
        set $diagnosis = external diagnosis();
        if($diagnosis.should_stop == true){
            #sayText("I think I have a conclusion about your symptoms");
            goto conclusion;
        }else{
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
        #sayText("I think you might be having");
        set $conclusions = external conclusion();
        for (var c in $conclusions){
            #sayText(c.condition +" with " + c.probability + " of probability!");
        }
        #sayText("Is their anything I can help with you?");
        wait *;
    }
    transitions{
        repeat: goto root on #messageHasIntent("yes");
        bye_then: goto bye_then on #messageHasIntent("no");

    }
}

node bye_then {
    do {
        #sayText("Thank you and happy trails! ");
        exit;
    }
}


digression bye  {
    conditions { on #messageHasIntent("bye"); }
    do {
        #sayText("Thank you and happy trails! ");
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
