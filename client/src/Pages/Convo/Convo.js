import React from "react";
import "./Convo.css";
import Nav from "../../components/Nav/Nav";
import Footer from "../../components/Footer/Footer";
import io from "socket.io-client";
import * as SIP from "sip.js";
import { useEffect, useState } from "react";
import Ship from "../../Images/start-up.png";
import Result from "../Result/Result";
//Original
const socket = io.connect("http://localhost:8000");

const Convo = () => {
  //Dasha AI
  //TODO: Can turn into env after prod and deploy,just for convenient right now!
  const api = "http://localhost:8000";

  const getAccount = async () => {
    const response = await fetch(`${api}/sip`);
    const { aor, endpoint } = await response.json();
    return { aor, endpoint };
  };

  const createUser = async (aor, server) => {
    const user = new SIP.Web.SimpleUser(server, { aor });
    await user.connect();
    await user.register();
    return user;
  };

  const runCall = async (aor, name) => {
    const data = { aor, name };
    await fetch(`${api}/call`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  const [aor, setAor] = useState();
  const [endpoint, setEndpoint] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    const start = async () => {
      const { aor, endpoint } = await getAccount();
      setAor(aor);
      setEndpoint(endpoint);
      const user = await createUser(aor, endpoint);
      setUser(user);
      const audio = new Audio();
      user.delegate = {
        onCallReceived: async () => {
          await user.answer();
          audio.srcObject = user.remoteMediaStream;
          audio.play();
        },
        onCallHangup: () => {
          audio.srcObject = null;
        },
      };
    };
    start();
  }, []);
  const run = () => {
    runCall(aor, "Peter").catch(() => {});
  };
  const stop = async () => {
    window.location.reload();
    // await fetch(`${api}/stop`);
  };
  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      //Add message into chatbox
      setDialogue((prev) => [
        ...prev,
        { speaker: data.speaker, conversation: data.conversation, id: data.id },
      ]);
    });
  }, [socket]);

  const [scroll, setScroll] = useState(false);
  const [dialogue, setDialogue] = useState([]);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [end, setEnd] = useState(false);
  const [cause, setCause] = useState('');

  useEffect(() => {
    window.onscroll = () => {
      setScroll(true);
    };
    if (!scroll) {
      var element = document.getElementById("convoChatScroll");
      element.scrollTop = element.scrollHeight;
    }

     if(dialogue.length >= 1){
    dialogue.map((d) => {
      if(d.speaker === 3 ) localStorage.setItem('sex', d.conversation );
      else if(d.speaker === 4) localStorage.setItem('age', d.conversation );
      else if(d.speaker === 5) localStorage.setItem('cause', d.conversation );
      else if(d.speaker === 6) setEnd(true);
    })
  }
   
  }, [dialogue]);
 

  console.log(dialogue);
  if(end){
    window.location = 'http://localhost:3000/result';
  }

  return (
    <>
      <Nav />
        <div className="convo-main-container">
        <button className="utility--button convo-btn--one" onClick={run}>
          start diagnosis
          <img src={Ship} alt="start" />
        </button>
        <button className="utility--button convo-btn--two" id="hangupButton" onClick={stop}>
          stop diagnosis
          <img src={Ship} alt="stop" />
        </button>
        <div id="convoChatScroll" className="convo-chat--container">
          {dialogue.length >= 1 && 
            dialogue.map((d,ind) => {
              return (
                <div
                  key={ind}
                  style={{display:`${(d.speaker === 3 || d.speaker === 4 || d.speaker === 6 || d.speaker === 6)?'none':null}`}}
                  className={`convo-message--contaner ${d.speaker === 1 && "message-two"}`}
                >
                  <h3>{(d.speaker === 0 && "Dasha") || (d.speaker === 1 && "You")}</h3>
                  <p>{( d.speaker === 0 || d.speaker === 1) && d.conversation}</p>
                </div>
              );
            })}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Convo;
