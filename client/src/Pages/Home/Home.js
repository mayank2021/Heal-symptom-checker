import React from 'react';
import './Home.css';
import Heart from '../../Images/healthcare.png';
import Pill from '../../Images/pills.png';
import Report from '../../Images/medical-report.png';
import Nav from '../../components/Nav/Nav';
import Footer from '../../components/Footer/Footer';

const Home = () => {
  return (
  <>
  <Nav/>
    <div className='home-container'>
      <div className='home-left--container'>
          <div className='home-image--container'>
          <img src={Report} alt="heart"/>
          </div>
          <div className='home-image--container'>
          <img src={Pill} alt="pill"/>
          </div>
          <div className='home-image--container'>
          <img src={Heart} alt="report"/>
          </div>
      </div>
      <div className='home-right--container'>
      <h1>Find the cause</h1>
      <p>Safe and anonymous health checkup. Your answers will be carefully analyzed and you’ll learn about possible causes of your symptoms.</p>
<button>start now</button>
</div>
    </div>
    <Footer/>
  </>
  )
}

export default Home