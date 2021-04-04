import React, { Component } from "react";
import '../styles/Auth.css';
import { axiosApiInstance } from '../helper.js';
import Cookie from 'js-cookie';


class PasswordReset extends Component {
  constructor(props){
    super(props);
    this.state = {
      jwt: '',
      password: '',
      status: ''
    };
    Cookie.set("access_token", props.match.params.jwt, { SameSite: 'lax' });
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
    await axiosApiInstance.post(`/api/password_reset`,
      { password: this.state.password }
    ).then(response => {
      this.setState({ "status": "Password reset successfully"})
      this.props.globalLogin(
        response.data.access_token,
        response.data.refresh_token,
        response.data.username
      );
      this.props.history.push(`/`);
    }).catch(error => {
      console.log(error);
    });
  }

  render() {
    return (
      <div>
      <form className="authBox" onSubmit={this.handleSubmit}>
        <h1>Reset Password</h1>
        <label>
          Password:
        </label>
        <input
          name="password"
          type="password"
          value={this.state.password}
          onChange={this.handleInputChange} />
        <br/>
        <input type="submit" value="Submit" />
        <p>{this.state.status}</p>
      </form>
      </div>
    );
  }
}

export default PasswordReset;
