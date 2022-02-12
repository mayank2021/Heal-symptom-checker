import React,{useEffect} from 'react';
import io from 'socket.io-client';


const socket = io.connect("http://localhost:8000");

const Chat = () => {
    useEffect(() => {
        socket.on("receive_message", (data) => {
        console.log(data)
        })
      }, 
      [socket]
      );
      
  return (
    <div>Chat</div>
  )
}

export default Chat