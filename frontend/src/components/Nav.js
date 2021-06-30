import React, { Component } from "react";
import '../styles/Nav.css';
import {Link} from 'react-router-dom';
import { logo, searchButton } from '../svg/index.js';

class Nav extends Component {
  render() {
    return (
      <div className="navbar">
        <div className="innerNav">
          <div className="mainNav">
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
          <div className="subNav">
            <a href="https://github.com/lukew3/ideaspot">Github</a>
            <Link to="/about">About</Link>
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

          <div id="accountDropdownContiner" onClick={() => {
            if (document.getElementById("navAccountMenu").style.display === 'none') {
              document.getElementById("navAccountMenu").style.display = 'grid';
            } else {
              document.getElementById("navAccountMenu").style.display = 'none';
            }
          }}>
            <p className="a" style={{"display": "flex"}}>
              <p>Account</p>
              <p id="accountDropdownArrow">▼</p>
            </p>
            <div className="customDropMenu" id="navAccountMenu" style={{"display": "none"}}>
              <p>Logged in as:</p>
              <Link to={`/${this.props.username}`} className="dropdownItem">{this.props.username}</Link>
              <div className="customDropMenuDivider"></div>
              <Link to={`/${this.props.username}`} className="dropdownItem">My profile</Link>
              <Link to={`/myIdeas/`} className="dropdownItem">My Ideas</Link>
              <div className="customDropMenuDivider"></div>
              <Link to={`/settings/`} className="dropdownItem">Settings</Link>
              <Link to={`/trash/`} className="dropdownItem">Trash</Link>
              <p className="dropdownItem" onClick={() => {
                this.props.globalLogout();
              }}>Sign Out</p>
            </div>
          </div>
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
