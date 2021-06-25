import React, { Component } from "react";
import '../styles/Nav.css';
import {Link} from 'react-router-dom';
import { logo, searchButton } from '../svg/index.js';

class Nav extends Component {
  render() {
    return (
      <div className="navbar">
        <div className="innerNav">
          <Link to={'/'}>
            <img className="navLogo" src={logo} alt="Ideaspot" />
          </Link>
          <div className="navSearchBarGroup">
            <img src={searchButton} alt="Search button" className="navSearchButton"/>
            <input className="navSearchBar" type="text" placeholder="Search..." />
          </div>
          <div className="navRight">
            <LoginNav
              isLoggedIn={this.props.isLoggedIn}
              globalLogout={this.props.globalLogout}
              username={this.props.username} />
          </div>
        </div>
      </div>
    );
  }
}

class LoginNav extends Component {
  render() {
    if (this.props.isLoggedIn) {
      return (
        <div>
        <Link to={'/newIdea'}>
          <p>New Idea</p>
        </Link>

        <Link to={`/${this.props.username}`}>
          <p>Account</p>
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
          <p className="signUpText">Sign Up</p>
        </Link>
        </div>
      );
    }
  }
}

export default Nav;
