import React, { Component } from "react";
import '../styles/Nav.css';
//import axios from 'axios';
import {Link} from 'react-router-dom';
//import Cookie from 'js-cookie';


class Nav extends Component {
  render() {
    return (
      <div className="navbar">
        <div className="innerNav">
          <Link to={'/'}>
            <p><strong>Build My Idea</strong></p>
          </Link>

          <Link to={'/newIdea'}>
            <p>Create Idea</p>
          </Link>

          <Link to={'/myIdeas'}>
            <p>My Ideas</p>
          </Link>
        </div>
      </div>
    );
  }
}

export default Nav;
