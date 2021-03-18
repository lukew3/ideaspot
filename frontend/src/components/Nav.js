import React, { Component } from "react";
import '../styles/Nav.css';
//import axios from 'axios';
import {Link} from 'react-router-dom';
import Cookie from 'js-cookie';


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

          <div class="navRight">
            <LoginNav isLoggedIn={this.props.isLoggedIn} globalLogout={this.props.globalLogout}/>
          </div>
        </div>
      </div>
    );
  }
}

class LoginNav extends Component {
  render() {
    if (this.props.isLoggedIn) {
      const username = Cookie.get("username") ? Cookie.get("username") : null;
      return (
        <div>
        <Link onClick={() => {this.props.globalLogout();}}>
          <p>Logout</p>
        </Link>

        <Link to={`/${username}`}>
          <p>Profile</p>
        </Link>
        </div>
      )
    } else {
      return(
        <div>
        <Link to={'/login'}>
          <p>Login</p>
        </Link>

        <Link to={'/register'}>
          <p>Register</p>
        </Link>
        </div>
      );
    }
  }
}

export default Nav;
