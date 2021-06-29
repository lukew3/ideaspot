import React, { Component } from "react";
import { IdeaBox, Comments } from '../components/index.js';
import axiosApiInstance from '../helper.js';
import { addButton } from '../svg/index.js';
import '../styles/ViewIdea.css';
import '../styles/IdeaBox.css';

class ViewIdea extends Component {
  constructor(props){
    super(props);
    this.state = {
      ideaId: props.match.params.ideaId,
      idea: {}
    }
  }
  // on mount, load subscriptions
  componentDidMount() {
    axiosApiInstance.get(`/api/get_idea/${this.state.ideaId}`
    ).then(response => {
      this.setState({ idea: response.data.idea });
    }).catch(error => {
      console.log("Login invalid");
    });
  }

  render() {
    const idea = this.state.idea;
    return (
      <div className="viewIdeaMainContainer" key={idea._id}>
        <div className="viewIdeaLeft">
          <IdeaBox
            idea={idea}
            hideScore={false}
            boxStyle="full"/>
          { //cheange hidescore to true if you go with the original design
            //might be a good idea to let the text wrap underneath the score instead of being pushed to the right. THis makes for better reading on mobile
          }

          {//<NewComment idea={idea} addCommentLocal={this.addCommentLocal}/>
          }
          <Comments
            ideaId={idea._id}
            comments={idea.comments}/>
        </div>
        <div className="viewIdeaRight">
          <IdeaBuilds />
          {
            /*
          <div className="viewIdeaTeams">
            <div className="addTeamButton"></div>
            <h2>Teams</h2>
            <h4>looking for members</h4>
            {
              //list links to exisinting products here
            }
            <h4>not looking for members</h4>
            {
              //list links to builds here
            }
            <h4>{} users building</h4>
            <h4>{} users want to build</h4>
          </div>
          */
        }
        </div>
      </div>
    );
  }
}

function IdeaBuilds(props) {
  function renderBuildList() {
    return(
      <div>
        <h4>built</h4>
        <ul></ul>
      </div>
    )
  }
  function renderExistingList() {
    return(
      <div>
        <h4>similar existing</h4>
        <ul></ul>
      </div>
    )
  }
  return(
    <div className="viewIdeaBuilds viewIdeaRightBox">
      <div className="viewIdeaRightBoxUpper">
        <h2>Builds</h2>
        <img className="addBuildButton" src={addButton} alt="submit build"/>
      </div>
      {renderExistingList()}
      {renderBuildList()}
      <h4>{0} users building</h4>
      <h4>{0} users want to build</h4>
    </div>
  )
}


export default ViewIdea;
