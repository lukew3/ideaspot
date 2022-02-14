import React, { Component } from "react";
import { IdeaBox, Comments, Builds } from '../components/index.js';
import axiosApiInstance from '../helper.js';
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
    if (idea === "unauthorized") {
      return (
        <div className="blankPageTextContainer">
          <h2>
            You are unauthorized to view this idea
          </h2>
        </div>
      )
    } else if (idea === "deleted") {
      return (
        <div className="blankPageTextContainer">
          <h2>
            This idea has been deleted
          </h2>
        </div>
      )
    }
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
          <Builds
            ideaId={this.state.ideaId}
            idea={this.state.idea} />
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


export default ViewIdea;
