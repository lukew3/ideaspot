import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Cookie from 'js-cookie';
import axiosApiInstance from '../helper.js';
import queryString from 'query-string';

class Settings extends Component {
  constructor(props){
    super(props);
    this.state = {
      oldPassword: "",
      newPassword: "",
      newEmail: "",
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmitPasswordUpdate = this.handleSubmitPasswordUpdate.bind(this);
    this.handleSubmitEmailUpdate = this.handleSubmitEmailUpdate.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  }

  handleSubmitPasswordUpdate(event) {
    event.preventDefault();
    axiosApiInstance.patch(`/api/changePassword`,
      { oldPassword: this.state.oldPassword,
        newPassword: this.state.newPassword }
    ).then(response => {
      document.getElementById("passwordUpdateStatus").innerHTML = "Password updated successfully";
    }).catch(error => {
      document.getElementById("passwordUpdateStatus").innerHTML = "Password update failed";
      console.log(error);
      console.log("Error");
    });
  }

  handleSubmitEmailUpdate(event) {
    event.preventDefault();
    axiosApiInstance.patch(`/api/changeEmail`,
      { newEmail: this.state.newEmail }
    ).then(response => {
      document.getElementById("emailUpdateStatus").innerHTML = "Email updated successfully";
      console.log("Email updated successfully")
    }).catch(error => {
      document.getElementById("emailUpdateStatus").innerHTML = "Email update failed";
      console.log(error);
      console.log("Error");
    });
  }

  render() {
    return(
      <div className="normalBox settingsPage">
        <h2>Settings</h2>
        <form className="settingsGroup" onSubmit={this.handleSubmitPasswordUpdate}>
          <h4>Change password</h4>
          <input
            name="oldPassword"
            type="password"
            placeholder="current password"
            value={this.state.oldPassword}
            onChange={this.handleInputChange} />
          <br></br>
          <input
            name="newPassword"
            type="password"
            placeholder="new password"
            value={this.state.newPassword}
            onChange={this.handleInputChange} />
          <br></br>
          <input type="submit" value="Submit"/>
          <p id="passwordUpdateStatus"></p>
        </form>
        <form className="settingsGroup" onSubmit={this.handleSubmitEmailUpdate}>
          <h4>Change email</h4>
          <input
            name="newEmail"
            type="text"
            placeholder="new email"
            value={this.state.newEmail}
            onChange={this.handleInputChange} />
          <br></br>
          <input type="submit" value="Submit"/>
          <p id="emailUpdateStatus"></p>
        </form>
        {
          /*
          <div className="settingsGroup">
            <h4>Delete all ideas</h4>
            <button>Delete</button>
          </div>
          */
        }
      </div>
    )
  }
}

export default Settings;
