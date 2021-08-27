import React, { Component } from "react";
import '../styles/Auth.css';
import axiosApiInstance from '../helper.js';
import {Link} from 'react-router-dom';


class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    await axiosApiInstance.post(`/api/login`,
      { username: this.state.username,
        password: this.state.password }
    ).then(response => {
      if (response.data.success === true) {
        this.props.globalLogin(
          response.data.access_token,
          response.data.refresh_token,
          response.data.username
        );
        this.props.history.push(`/`);
      } else {
        document.getElementById('loginMessage').innerHTML = response.data.message;
        document.getElementById('loginMessage').style.display = 'block';
      }
    }).catch(error => {
      console.log("Login invalid");
    });
  }

  render() {
    return (
      <div>

      <form className="authBox" onSubmit={this.handleSubmit}>
        <h1>Login</h1>
        <div className="inputGroup">
          <label>
            Username or Email:
          </label>
          <br/>
          <input
            name="username"
            type="text"
            value={this.state.username}
            onChange={this.handleInputChange} />
          <br/>
        </div>
        <div className="inputGroup">
          <label>
            Password:
          </label>
          <br/>
          <input
            name="password"
            type="password"
            value={this.state.password}
            onChange={this.handleInputChange} />
          <br/>
          <Link to="/requestPasswordReset" className="forgotPasswordLink">Forgot password?</Link>
          <br/>
        </div>
        <input type="submit" value="Submit" />
        <br/>
        <p id="loginMessage"></p>
        <p className="loginSignUpSwitch">Don't have an account? <Link to="/register">Sign Up</Link></p>
      </form>
      <p>{this.state.status}</p>
      </div>
    );
  }
}

export default Login;
