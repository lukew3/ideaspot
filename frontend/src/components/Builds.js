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

export default IdeaBuilds;
