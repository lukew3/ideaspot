import React, { Component } from "react";
import '../styles/Profile.css';
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
      if (response.data.bio == undefined) response.data.bio = "";
      if (response.data.buildCount == undefined) response.data.buildCount = 0;
      this.setState({ user: response.data });
    }).catch(error => {
      console.log(error);
    });
  }

  render() {
    return (
      <div className="profilePage">
        <div className="profileGrid">
          <div className="profileOverview standardBorder">
            <h1 className="profileUsername">{this.state.user.username}</h1>
            <p>{this.state.user.bio}</p>
            <EditProfile user={this.state.user.username}/>
            <div className="profileStats">
              <p className="profileStat"><strong>{this.state.user.ideasCount}</strong> reputation earned</p>
              <p className="profileStat"><strong>{this.state.user.ideasCount}</strong> ideas written</p>
              <p className="profileStat"><strong>{this.state.user.buildCount}</strong> ideas built</p>

              {//should be a rep breakdown that shows on hover(possibly click for mobile)
                //how much is earned from created ideas, built ideas, suggestions, etc.
                //could have public rep to show contributions to the platform and private rep for how the user uses the platform for themselves
              }
             </div>
          </div>

          <div className="profileRight standardBorder">
            <div className="profileSectionSelector">
              <div className="profileSelectorItem selActive selIdeas">Ideas ({this.state.user.ideasCount})</div>
              <div className="profileSelectorItem selBuilds">Builds ({this.state.user.buildCount})</div>
              <div className="profileSelectorItem selTeams">Teams</div>
            </div>
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
      <div type="button" className="editProfileButton">
        <p>Edit Profile</p>
      </div>
    );
  } else {
    return(
      <div></div>
    );
  }
}

export default Profile;
