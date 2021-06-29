import React, { Component } from "react";
//import ReactMarkdown from 'react-markdown';
//import Tags from './Tags.js';
import { Link } from 'react-router-dom';
import Cookie from 'js-cookie';
import axiosApiInstance from '../helper.js';


class Profile extends Component {
  constructor(props){
    super(props);
    this.state = {
      user: {
        "ideas": []
      }
    }
  }

  componentDidMount() {
    axiosApiInstance.get(`/api/get_user/${this.props.match.params.username}`).then(response => {
      this.setState({ user: response.data });
    }).catch(error => {
      console.log(error);
    });
  }

  render() {
    return (
      <div className="profilePage">
        <div className="profileGrid">
          <div className="profileStats standardBorder">
            <h1>{this.state.user.username}</h1>
            <EditProfile user={this.state.user.username}/>
            <div>
             <h2>Stats:</h2>
             <p>Created ideas: {this.state.user.ideasCount}</p>
             <p>Rep: {this.state.user.ideasCount}</p>
             {//should be a rep breakdown that shows on hover(possibly click for mobile)
               //how much is earned from created ideas, built ideas, suggestions, etc.
               //could have public rep to show contributions to the platform and private rep for how the user uses the platform for themselves
             }
             </div>
          </div>
          <div className="profileIdeas standardBorder">
            <h2>Ideas:</h2>
            <div className="ideaFeed">
              {this.state.user.ideas.map((idea, index) => (
                <div className="standardBorder profileIdea">
                  <Link to={`/idea/${idea._id}`}><h3>{idea.title}</h3></Link>
                </div>
              ))}
            </div>
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
        <p  className="orangeLink">Edit</p>
        <Link to={'/trash'} className="redLink">View Trash</Link>
      </div>
    );
  } else {
    return(
      <div className="editProfileButton"></div>
    );
  }
}

export default Profile;
