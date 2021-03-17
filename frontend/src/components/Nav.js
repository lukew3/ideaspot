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
            <LoginNav />
          </div>
        </div>
      </div>
    );
  }
}

class LoginNav extends Component {
  constructor(props){
    super(props);
    this.state = {
      token: (Cookie.get("token") ? Cookie.get("token") : null)
    }
  }
  render() {
    if (this.state.token == null) {
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
    } else {
      return (
        <div>
        <Link onClick={() => {Cookie.remove("token"); this.setState({ "token": null });}}>
          <p>Logout</p>
        </Link>

        <Link to={'/profile'}>
          <p>Profile</p>
        </Link>
        </div>
      )
    }
  }
}

export default Nav;
