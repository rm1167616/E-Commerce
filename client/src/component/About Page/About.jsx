// About.jsx
import React from 'react'
import './About.css'
import { teamMembers } from '../../Assets/data'

function About() {
  return (
    <div className="About">
      <div className="Content-About">
        <h1 style={{ textAlign: "center" }}>About Us</h1>
        <div className="All-Cards">
          {teamMembers.map((item, index) => (
            <div 
              className={`Cardd ${index % 2 === 0 ? '' : 'Cardd-reverse'}`} 
              key={index}
            >
              <img className='imagine' src={item.image} alt={item.name} />
              <div className="detailes">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default About