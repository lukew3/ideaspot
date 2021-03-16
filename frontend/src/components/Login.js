//Display all boxes, clicking on a box shows releases with urls shown in that div
import React, { Component } from "react";
import axios from 'axios';
import Cookie from 'js-cookie';
import '../styles/Auth.css';

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
    const urlbase = 'localhost:5001';
    await axios.post(`${urlbase}/api/login`,
      { username: this.state.username,
        password: this.state.password }
    ).then(response => {
      const token = response.data.token;
      Cookie.set("token", token, { SameSite: 'lax' });
      this.props.history.push(`/`);
    }).catch(error => {
      console.log("Login invalid");
    });
  }

  render() {
    return (
      <div>

      <form className="authBox" onSubmit={this.handleSubmit}>
        <h1>Login</h1>
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
      </form>
      <p>{this.state.status}</p>
      </div>
    );
  }
}

export default Login;
