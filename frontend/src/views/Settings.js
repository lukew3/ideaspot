import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Cookie from 'js-cookie';
import axiosApiInstance from '../helper.js';
import queryString from 'query-string';

class Settings extends Component {
  constructor(props){
    super(props);
    this.state = {
      user: {
      },
    }
  }

  componentDidMount() {
  }

  render() {
    return(
      <div className="normalBox settingsPage">
        <h2>Settings</h2>
        <div className="settingsGroup">
          <h4>Change password</h4>
          <input type="text" placeholder="current password"></input>
          <br></br>
          <input type="text" placeholder="new password"></input>
        </div>
        <div className="settingsGroup">
          <h4>Change email</h4>
          <input type="text" placeholder="new email"></input>
        </div>
        <div className="settingsGroup">
          <h4>Delete all ideas</h4>
          <button>Delete</button>
        </div>
      </div>
    )
  }
}

export default Settings;
