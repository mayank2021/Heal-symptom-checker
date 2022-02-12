import React from 'react'
import Card from '../Card/Card';
import "./Status.css";

function Status() {
  return (
    <div className='status'>
        <h3>Your Status </h3>
        <div className='cards' >
            <Card Name={"Blood status"} status={"5/10"} />
            <Card Name={"Blood status"} status={"5/10"} />
            <Card Name={"Blood status"} status={"5/10"} />
            <Card Name={"Blood status"} status={"5/10"} />
        </div>
    </div>
  )
}

export default Status;