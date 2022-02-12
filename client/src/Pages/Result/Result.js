import React from 'react'
import "./Result.css";
import Diagnosis from './Diagnosis/Diagnosis';
import Status from './Status/Status';

function Result() {
  return (
    <div style={{color:"white"}} className="result" >
      
      <nav>
        <h3 style={{height: "3em" }} > Symptom Checker </h3>
        <i class="fa-regular fa-bell"></i>
        <img src="" alt="" />
      </nav>

      <section className='section-first' >
        <div className="heart-cont">
          <Diagnosis/>
        </div>
        <div className='status-cont' >
          <Status/>
        </div>
      </section>
      <br /><br />

      <section className='section-second' >
        
        <div className="heart-rate">
          <header > 
            <h4>Heart Rate</h4>
            <p className='bpm'> 75 bmp average</p>
            
          </header>
        </div>

        <div className='documents' >
          <header className='group' >
          <h3>Documents</h3>
          <button>view all</button>
          </header>
          <br />
          <ul>
            <li className='group' > <h5>Report 1 .pdf</h5> <button > download </button>  </li>
            <li className='group' > <h5>Report 2 .pdf</h5> <button > download </button>  </li>
            <li className='group' > <h5>Report 3 .pdf</h5> <button > download </button>  </li>
            <li className='group' > <h5>Report 4 .pdf</h5> <button > download </button>  </li>
          </ul>
        </div>
      </section>

    </div>
  )
}

export default Result;