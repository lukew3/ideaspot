import React, { Component } from "react";
import axios from 'axios';
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
    await axios.post(`/api/login`,
      { username: this.state.username,
        password: this.state.password }
    ).then(response => {
      this.props.globalLogin(response.data.token, response.data.username);
      this.props.history.push(`/`);
    }).catch(error => {
      console.log(error)
      console.log("Login invalid");
    });
  }

  render() {
    return (
      <div>

      <form className="authBox" onSubmit={this.handleSubmit}>
        <h1>Login</h1>
        <label>
          Username or Email:
        </label>
        <input
          name="username"
          type="text"
          value={this.state.username}
          onChange={this.handleInputChange} />
        <br/>
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
        <input type="submit" value="Submit" />
      </form>
      <p>{this.state.status}</p>
      </div>
    );
  }
}

export default Login;
