import React, { Component } from "react";
import '../styles/Auth.css';
import { axiosApiInstance } from '../helper.js';
import {Link} from 'react-router-dom';


class Register extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
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
    await axiosApiInstance.post(`/api/register`,
      { email: this.state.email,
        username: this.state.username,
        password: this.state.password }
    ).then(response => {
      this.props.globalLogin(
        response.data.access_token,
        response.data.refresh_token,
        response.data.username
      );
      this.props.history.push(`/`);
    }).catch(error => {
      console.log(error);
      console.log("Registration invalid");
    });
  }

  render() {
    return (
      <div>

      <form className="authBox" onSubmit={this.handleSubmit}>
        <h1>Register</h1>
        <label>
          Email:
        <input
          name="email"
          type="text"
          value={this.state.email}
          onChange={this.handleInputChange} />
        </label>
        <br/>
        <label>
          Username:
        <input
          name="username"
          type="text"
          value={this.state.username}
          onChange={this.handleInputChange} />
        </label>
        <br/>
        <label>
          Password:
        <input
          name="password"
          type="password"
          value={this.state.password}
          onChange={this.handleInputChange} />
        </label>
        <br/>
        <input type="submit" value="Submit" />
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </form>
      <p>{this.state.status}</p>
      </div>
    );
  }
}

export default Register;
