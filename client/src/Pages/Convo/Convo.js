import React from 'react';
import './Convo.css';
import Nav from '../../components/Nav/Nav';
import Footer from '../../components/Footer/Footer';

const Convo = () => {
  return (
    <>
      <Nav/>
      <div className='convo-main-container'>
          <div className='convo-chat--container'>
            <div className='convo-message--contaner'>
              <h3>Mayank</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod</p>
              <span>00:50</span>
            </div>
            <div className='convo-message--contaner message-two'>
              <h3>Dasha</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod</p>
              <span>00:51</span>
            </div>
            <div className='convo-message--contaner'>
              <h3>Mayank</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod</p>
              <span>00:50</span>
            </div>
            <div className='convo-message--contaner message-two'>
              <h3>Dasha</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod</p>
              <span>00:51</span>
            </div>
          </div>
      </div>
      <Footer/>
    </>
  )
}

export default Convo