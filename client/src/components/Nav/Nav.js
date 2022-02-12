import React from 'react';
import './Nav.css';
import Heal from "../../Images/pharmacy.png";

const Nav = () => {
  return (
    <div className='navbar'>
      <img src={Heal} alt="heal"/>
      <h1>Heal</h1>
    </div>
  )
}

export default Nav