import React from 'react';
import './Convo.css';
import Nav from '../../components/Nav/Nav';
import Footer from '../../components/Footer/Footer';
import io from "socket.io-client";
import * as SIP from "sip.js";
import { useEffect, useState } from "react";

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
  const [user,setUser] = useState();

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
  const stop = async() =>{
    window.location.reload();
    // await fetch(`${api}/stop`);
  }
  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      //Add message into chatbox
      setDialogue((prev)=>[...prev,{speaker:data.speaker,conversation:data.conversation,id:data.id}])
    });
  }, [socket]);

  const [scroll,setScroll] = useState(false);
  const [dialogue,setDialogue] = useState([]);

useEffect(() => {
  window.onscroll = () => { setScroll(true)}
  if(!scroll){
    var element = document.getElementById("convoChatScroll");
    element.scrollTop = element.scrollHeight;
}
}, [dialogue])


  return (
    <>
      <Nav/>
      <div className='convo-main-container'>
        <button onClick={run}>start</button>
        <button id="hangupButton" onClick={stop}>stop</button>
          <div id="convoChatScroll" className='convo-chat--container'>
          {dialogue.length>=1 && dialogue.map((d)=> {
            return (
              <div key={d.id} className={`convo-message--contaner ${d.speaker !== 0?'message-two':null}`}>
              <h3>{d.speaker === 0?'Dasha':'You'}</h3>
              <p>{d.conversation}</p>
              {/* <span>00:50</span> */}
            </div>
            )
          })}
          </div>
      </div>
      <Footer/>
    </>
  )
}

export default Convo