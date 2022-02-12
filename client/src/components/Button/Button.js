import React from 'react';
import './Button.css';

const Button = ({title}) => {
  return (
    <button className='utility--button'>{title}</button>
  )
}

export default Button