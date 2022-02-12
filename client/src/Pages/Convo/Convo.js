import React , { useState } from 'react';
import './Convo.css';

const Convo = () => {
  const [userMessage, setuserMessage] = useState("ritesh");
  const createMessage = () => {
    const messageCont = document.createAttribute("li");
  }
  return (
    <div className='convo'>
      <div className="convo-content">
        <div className="chat-header">
          <img src="" alt="" />
          <div className='icons-section' >
            
          </div>
        </div>
        <ul className='conversation' id='conversation' >
          <li>{ userMessage }</li>
        </ul>
        <div className="input-user">
          <input type="text"  onChange= { (event) => { setuserMessage(event.target.value) }   } />
          <button onClick={ createMessage } >
            click
          </button>
        </div>

      </div>
    </div>
  )
}

export default Convo;