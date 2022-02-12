import io from "socket.io-client";
import * as SIP from "sip.js";
import { useEffect, useState } from "react";

//Original
const socket = io.connect("http://localhost:8000");

const Chat = () => {
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


  const [dialogue,setDialogue] = useState([]);

  console.log(dialogue);
  return (
    <>
    <div>Chat</div>
    <button onClick={run}>Chat with Dasha</button>
    <button id="hangupButton" onClick={stop}>Stop chat with Dasha</button>
    {dialogue.length>=1 && dialogue.map((d)=>(
      <div key={d.id}>
      <button>{d.speaker}</button>
      <button>{d.conversation}</button>
      </div>
    ))}
    </>
  );
};

export default Chat;
