import React, { Component } from "react";
import '../styles/Nav.css';
import {Link} from 'react-router-dom';


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
        <Link to='/' onClick={() => {this.props.globalLogout();}}>
          <p>Logout</p>
        </Link>

        <Link to={`/${this.props.username}`}>
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
