import React, { Component } from "react";
import axiosApiInstance from '../helper.js';
import { addButton } from '../svg/index.js';
import '../styles/Builds.css';

class IdeaBuilds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ideaId: props.ideaId,
      builds: props.idea.builds === undefined ? [] : props.idea.builds,
    }
  }

  render() {
    const renderExistingList = () => {
      const existingList = this.state.builds.filter(build => build.type === "existing");
      if (existingList.length > 0) {
        return(
          <div className="buildsSubBox">
            <h4 className="buildsSubtitle">similar existing</h4>
            {(existingList).map((build, index) => (
              <a href={build.link}>{build.link}</a>
            ))}
          </div>
        )
      } else {
        return <div></div>
      }
    }
    const renderBuildList = () => {
      const builtList = this.state.builds.filter(build => build.type === "built");
      if (builtList.length > 0) {
        return(
          <div className="buildsSubBox">
            <h4>built</h4>
            {(builtList).map((build, index) => (
              <a href={build.link}>{build.link}</a>
            ))}
          </div>
        )
      } else {
        return <div></div>
      }
    }
    const renderInput = () => {
      return(
        <div>
        </div>
      )
    }
    return(
      <div className="viewIdeaBuilds">
        <div className="viewIdeaRightBoxUpper">
          <h2>Builds</h2>
          <img className="addBuildButton" src={addButton} alt="submit build"/>
        </div>
        <BuildStatusSelector
          ideaId={this.state.ideaId}
          builds={this.state.builds} />
        {renderInput()}
        {renderExistingList()}
        {renderBuildList()}
        <div className="buildsSubBox buildsCommStatus">
          <h4>{this.state.builds.length} users built</h4>
          <h4>{0} users building</h4>
          <h4>{0} users want to build</h4>
        </div>
      </div>
    )
  }
}

class BuildStatusSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ideaId: props.ideaId,
      builds: props.builds,
      myStatus: "not_building",
      builtLink: "",
      selectedStatus: "not_building"
    }
    this.switchSelectedStatus = this.switchSelectedStatus.bind(this);
    this.setBuildStatus = this.setBuildStatus.bind(this);
  }

  switchSelectedStatus(event) {
    this.setState({selectedStatus: event.target.value});
  }

  setBuildStatus(event) {
    axiosApiInstance.post('/api/set_build_status', {
      ideaId: this.state.ideaId,
      status: this.state.selectedStatus,
      link: this.state.builtLink
    }).then((response) => {
      console.log(response);
      this.setState({myStatus: this.state.selectedStatus})
    })
  }

  render() {
    //should there be a submit button beside the selector?
    //this would prevent accidental changes to status, but leaving it without might be better for ease of use
    const renderInput = () => {
      //if selector selected "built", create form with link to build
    }
    const isLocked = () => {
      if (this.state.selectedStatus === this.state.myStatus) {
        return "locked"
      } else {
        return ""
      }
    }
    return(
      <div className="buildsStatus buildsSubBox">
        <p className="buildStatusLabel">My Status:</p>
        <select className="buildStatusSelector normalSelect" onChange={this.switchSelectedStatus}>
          <option value="not_building">not building</option>
          <option value="plan_to_build">plan to build</option>
          <option value="building">building</option>
          <option value="built">built</option>
        </select>
        {
          //button shoult be greyed out if the select field is not changed
          // also greyed if status is built and no link is included
          // add locked class to grey out
        }
        <button className={"buildStatusSelectButton normalSelect " + isLocked()} onClick={this.setBuildStatus}>Select</button>
      </div>
    )
  }
}

export default IdeaBuilds;
