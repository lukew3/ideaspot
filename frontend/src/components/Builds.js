import React, { Component } from "react";
import axiosApiInstance from '../helper.js';
import '../styles/Builds.css';

class IdeaBuilds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ideaId: props.ideaId,
      myBuildStatus: props.idea.myBuildStatus === undefined ? "not_building": props.idea.myBuildStatus,
      myBuildLink: props.idea.myBuildLink === undefined ? "" : props.idea.myBuildLink,
      builders: props.idea.builders === undefined ? { built: [], building: [], plan_to_build: []} : {
        built: props.idea.builders.built === undefined ? [] : props.idea.builders.built,
        building: props.idea.builders.building === undefined ? [] : props.idea.builders.building,
        plan_to_build: props.idea.builders.plan_to_build === undefined ? [] : props.idea.builders.plan_to_build,
      },
      builds: props.idea.builds === undefined ? [] : props.idea.builds,
    }
  }

  render() {
    const renderExistingList = () => {
      const existingList = [];
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
      const builtList = this.state.builders.built;
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
        </div>
        <BuildStatusSelector
          ideaId={this.state.ideaId}
          builds={this.state.builds}
          myBuildLink={this.state.myBuildLink}
          myStatus={this.state.myBuildStatus} />
        {renderInput()}
        {renderExistingList()}
        {renderBuildList()}
        <div className="buildsSubBox buildsCommStatus">
          <h4>{this.state.builders.built.length} users built</h4>
          <h4>{this.state.builders.building.length} users building</h4>
          <h4>{this.state.builders.plan_to_build.length} users plan to build</h4>
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
      myStatus: props.myStatus,
      builtLink: props.myBuildLink,
      currentBuiltLink: props.myBuildLink,
      selectedStatus: props.myStatus,
    }
    this.switchSelectedStatus = this.switchSelectedStatus.bind(this);
    this.setBuildStatus = this.setBuildStatus.bind(this);
    this.setCurrentBuiltLink = this.setCurrentBuiltLink.bind(this);
    this.isLocked = this.isLocked.bind(this);
  }

  isLocked() {
    if (this.state.selectedStatus=== "built" && this.state.currentBuiltLink === "") {
      return "locked";
    } else if (this.state.selectedStatus === "built" && this.state.currentBuiltLink !== this.state.builtLink) {
      return ""
    } else if (this.state.selectedStatus === this.state.myStatus) {
      return "locked";
    } else {
      return "";
    }
  }

  switchSelectedStatus(event) {
    this.setState({selectedStatus: event.target.value});
  }

  setBuildStatus(event) {
    if (this.isLocked() === "locked") return;
    axiosApiInstance.post('/api/set_build_status', {
      ideaId: this.state.ideaId,
      status: this.state.selectedStatus,
      link: this.state.currentBuiltLink
    }).then((response) => {
      console.log(response);
      this.setState({myStatus: this.state.selectedStatus, builtLink: this.state.currentBuiltLink})
    })
  }

  setCurrentBuiltLink(event) {
    this.setState({currentBuiltLink: event.target.value});
  }

  render() {
    const renderInput = () => {
      //if selector selected "built", create form with link to build
      if (this.state.selectedStatus === 'built') {
        return <input type="text" className="buildStatusLinkInput" value={this.state.currentBuiltLink} onChange={this.setCurrentBuiltLink}></input>
      } else {
        return
      }
    }
    return(
      <div className="buildsStatus buildsSubBox">
        <p className="buildStatusLabel">My Status:</p>
        <select className="buildStatusSelector normalSelect" onChange={this.switchSelectedStatus} value={this.state.selectedStatus}>
          <option value="not_building">not building</option>
          <option value="plan_to_build">plan to build</option>
          <option value="building">building</option>
          <option value="built">built</option>
        </select>
        {renderInput()}
        <button className={"buildStatusSelectButton normalSelect " + this.isLocked()} onClick={this.setBuildStatus}>Select</button>
      </div>
    )
  }
}

export default IdeaBuilds;
