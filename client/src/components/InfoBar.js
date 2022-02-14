import React, { Component } from "react";
import '../styles/InfoBar.css';
import {Link} from 'react-router-dom';

class InfoBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div className="infoBar">
        <Link to={'/about'}>About</Link>
        <a href="mailto: lukew25073@gmail.com">Contact</a>
        <a href="https://github.com/lukew3/ideaspot">Github</a>
        {/*
          <Link to={'/donate'}>Donate</Link>
        */}
        <a href="https://www.paypal.com/paypalme/weilerluke">Donate</a>
      </div>
    );
  }
}


export default InfoBar;
