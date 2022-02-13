import React from 'react'
import "./Result.css";
import Nav from '../../components/Nav/Nav';
import Footer from '../../components/Footer/Footer';
import Card from './Card/Card';
import Weight from '../../Images/scale.png';
import Height from '../../Images/height.png';
import Sex from '../../Images/sex.png';
import Age from '../../Images/age.png';

function Result() {

  const sex = localStorage.getItem('sex');
  const age = localStorage.getItem('age');
  const cause = localStorage.getItem('cause');

  return (
    <>
    <Nav/>
    <div className='result-main--container'>
      <h1>Conclusion</h1>
     <div className='result-top--container'>
      <div className='basic-info'>
         <Card img={Age} title="Age" value={age}/>
         <Card img={Sex} title="Sex" value={sex}/>
      </div>
     </div>
     <div className='result-bottom--container'>
      Possible cause:<span>{cause}</span>
     </div>
    </div>
    <Footer/>
    </>
  )
}

export default Result;

// <div className='result-bmi-container'>
//         <div className='bmi-element--container utility-bold'>
//           <p>BMI</p>
//           <span>Weight</span>
//         </div>
//         <div  className='bmi-element--container'>
//           <p>Below 18.5</p>
//           <span>Under weight</span>
//         </div>
//         <div  className='bmi-element--container'>
//           <p>18.5 - 24.9</p>
//           <span>Normal weight</span>
//         </div>
//         <div  className='bmi-element--container'>
//           <p>25.0 - 29.9</p>
//           <span>Over weight</span>
//         </div>
//         <div  className='bmi-element--container'>
//           <p>30.0 - 34.9</p>
//           <span>Obesity class 1</span>
//         </div>
//         <div  className='bmi-element--container'>
//           <p>35.0 - 39.9</p>
//           <span>Obesity class 2</span>
//         </div>
//         <div  className='bmi-element--container'>
//           <p>Above 40</p>
//           <span>Obesity class 4</span>
//         </div>
//         <div  className='bmi-element--container utility-bold'>
//           <p>Your BMI</p>
//           <span>45</span>
//         </div>
//       </div>
//       <div className='result-chart--container'>
//            <img src="https://lh3.googleusercontent.com/g0Jw-I6-gH2DVCpnl3u8QKZVT_meR9lcJlpyeSZ-MyvwLnyEZvgyrY5frldA8HCv55s=w280-rwa" alt="alt"/>
//       </div>