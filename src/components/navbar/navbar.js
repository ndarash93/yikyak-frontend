import React from 'react';
import './navbar.css';

class Navbar extends React.Component{
  constructor(){
    super();
  }

  render(){
    return(
      <div className="navbar">
        <div className="banner">{this.props.name}</div>
      </div>
    )
  }
}

export default Navbar;