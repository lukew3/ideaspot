import React, { Component } from "react";
//import ReactMarkdown from 'react-markdown';
//import Tags from './Tags.js';
//import { Link } from 'react-router-dom';
import Cookie from 'js-cookie';

class Profile extends Component {
  constructor(props){
    super(props);
    this.state = {
      user: props.match.params.username,
    }
  }

  render() {
    return (
      <div className="profilePage">
        <div className="profileGrid">
          <div className="profileStats standardBorder">
            <h1>{this.state.user}</h1>
            <EditProfile user={this.state.user}/>
            <div>
             <h2>Stats:</h2>
             <p>Created ideas:</p>
             <p>Rep: </p>
             {//should be a rep breakdown that shows on hover(possibly click for mobile)
               //how much is earned from created ideas, built ideas, suggestions, etc.
             }
             </div>
          </div>
          <div className="profileIdeas standardBorder">
            <h2>Pinned/popular Ideas:</h2>
          </div>
        </div>
      </div>
    );
  }
}


function EditProfile(props) {
  const username = Cookie.get("username") ? Cookie.get("username") : null;
  if (username === props.user) {
    return(
      <div className="editProfileButton">
        <p>Edit</p>
      </div>
    );
  } else {
    return(
      <div className="editProfileButton"></div>
    );
  }
}

export default Profile;
