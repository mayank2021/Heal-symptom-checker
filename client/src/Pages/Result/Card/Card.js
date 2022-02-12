import React from 'react'
import "./Card.css"


function Card({Name, status}) {
  return (
    <div className='card'>
        <p> {Name} </p>
        <div className="status-group">
            <div className="img-img">
              <img style={{width:"100%"}} src="" alt="" />
            </div>
            <p> {status} </p>
        </div>
    </div>
  )
}

export default Card