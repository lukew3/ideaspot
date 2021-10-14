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
        "built": [],
        "building": [],
        "plan_to_build": [],
      },
      activeTab: tab === undefined ? "ideas" : tab,
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
      } else if (this.state.activeTab === "built") {
        return (
          <div className="ideaFeed">
            {this.state.user.built.map((build, index) => (
              <div className="standardBorder profileIdea">
                <Link to={`/idea/${build._id}`}><h3>{build.title} - {build.build}</h3></Link>
              </div>
            ))}
          </div>
        )
      } else if (this.state.activeTab === "building") {
        return (
          <div className="ideaFeed">
            {this.state.user.building.map((build, index) => (
              <div className="standardBorder profileIdea">
                <Link to={`/idea/${build._id}`}><h3>{build.title}</h3></Link>
              </div>
            ))}
          </div>
        )
      } else if (this.state.activeTab === "plan_to_build") {
        return (
          <div className="ideaFeed">
            {this.state.user.plan_to_build.map((build, index) => (
              <div className="standardBorder profileIdea">
                <Link to={`/idea/${build._id}`}><h3>{build.title}</h3></Link>
              </div>
            ))}
          </div>
        )
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
            {
              /*
              <EditProfile user={this.state.user.username}/>
              */
            }
            <div className="profileStats">
              {
                /*
                <p className="profileStat"><strong>{this.state.user.ideasCount}</strong> reputation earned</p>
                */
              }
              <p className="profileStat"><strong>{this.state.user.ideasCount}</strong> ideas written</p>
              {
                /*
                <p className="profileStat"><strong>{this.state.user.buildCount}</strong> ideas built</p>
                */
              }
              <p className="profileStat"><strong>{this.state.user.reputation}</strong> reputation earned</p>
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
              }}>Ideas ({this.state.user.ideas.length})</div>
              <div id="builtTab" className="profileSelectorItem" onClick={() => {
                this.setActiveTab("built")
              }}>Built ({this.state.user.built.length})</div>
              <div id="buildingTab" className="profileSelectorItem" onClick={() => {
                this.setActiveTab("building")
              }}>Building ({this.state.user.building.length})</div>
              <div id="plan_to_buildTab" className="profileSelectorItem" onClick={() => {
                this.setActiveTab("plan_to_build")
              }}>Plan To Build ({this.state.user.plan_to_build.length})</div>
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
