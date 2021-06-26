import React, { Component } from "react";
import '../styles/Auth.css';
import { axiosApiInstance } from '../helper.js';

class RequestPassReset extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      status: ''
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
    await axiosApiInstance.post(`/api/request_password_reset`,
      {"email": this.state.email}
    ).then(response => {
      this.setState({ 'status': 'Email sent'})
      //this.props.history.push(`/`);
    }).catch(error => {
      console.log(error)
      this.setState({ 'status': 'Email invalid'})
    });
  }

  render() {
    return (
      <div>
      <form className="authBox" onSubmit={this.handleSubmit}>
        <h1>Request Password Reset</h1>
        <div className="inputGroup">
          <label>
            Email:
          </label>
          <input
            name="email"
            type="text"
            value={this.state.email}
            onChange={this.handleInputChange} />
          <br/>
        </div>
        <input type="submit" value="Submit" />
        <p>{this.state.status}</p>
      </form>
      </div>
    );
  }
}

export default RequestPassReset;
