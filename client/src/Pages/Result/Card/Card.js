import React from 'react'
import "./Card.css";


function Card({img,title,value}) {
  return (
    <div className='result-card--container'>
    <img src={img} alt="weight"/>
    <div>
      <h2>{title}</h2>
      <h2>{value}</h2>
    </div>
    </div>
  )
}

export default Card