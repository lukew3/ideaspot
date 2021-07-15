import React, { Component } from "react";
import '../styles/Profile.css';
import { Link } from 'react-router-dom';
import Cookie from 'js-cookie';
import axiosApiInstance from '../helper.js';
import queryString from 'query-string';

class Profile extends Component {
  constructor(props){
    super(props);
    let tab = queryString.parse(this.props.location.search).tab;
    this.state = {
      user: {
        "ideas": [],
      },
      activeTab: tab === undefined ? "ideas" : tab,
      builds: {},
    }
  }

  componentDidMount() {
    axiosApiInstance.get(`/api/user/${this.props.match.params.username}`).then(response => {
      if (response.data.bio === undefined) response.data.bio = "";
      if (response.data.buildCount === undefined) response.data.buildCount = 0;
      this.setState({ user: response.data });
    }).then(() => {
      this.setActiveTab(this.state.activeTab);
    }).catch(error => {
      console.log(error);
    });
  }

  setActiveTab(tabName, prevActiveTab=undefined) {
    if (this.state.activeTab) {
      document.getElementById(`${this.state.activeTab}Tab`).classList.remove("activeTab");
    }
    document.getElementById(`${tabName}Tab`).classList.add("activeTab");
    this.setState({activeTab: tabName});
    if (tabName !== "ideas") {
      this.props.history.push(`/${this.props.match.params.username}?tab=${tabName}`)
    } else {
      this.props.history.push(`/${this.props.match.params.username}`)
    }
  }

  render() {
    const renderTabContent = () => {
      if (this.state.activeTab === "ideas") {
        return (
          <div className="ideaFeed">
            {this.state.user.ideas.map((idea, index) => (
              <div className="standardBorder profileIdea">
                <Link to={`/idea/${idea._id}`}><h3>{idea.title}</h3></Link>
              </div>
            ))}
          </div>
        )
      } else if (this.state.activeTab === "builds") {
        return <div>Builds data</div>
        /*
        axiosApiInstance.get(`/api/user/${this.props.match.params.username}/builds`).then(response => {
          this.setState({builds: response.data});
        }).then(() => {
          return (
            <div>Test</div>
          )
        })
        */
      } else if (this.state.activeTab === "teams") {
        return <div>Teams data</div>
      }
    }
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
              <div id="ideasTab" className="profileSelectorItem" onClick={() => {
                this.setActiveTab("ideas");
              }}>Ideas ({this.state.user.ideasCount})</div>
              <div id="buildsTab" className="profileSelectorItem" onClick={() => {
                this.setActiveTab("builds")
              }}>Builds ({this.state.user.buildCount})</div>
              <div id="teamsTab" className="profileSelectorItem" onClick={() => { this.setActiveTab("teams")}}>Teams</div>
            </div>
            {renderTabContent()}
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
