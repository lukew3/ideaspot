import React, { Component } from "react";
import ReactMarkdown from 'react-markdown';
import Tags from './Tags.js';
import { Link } from 'react-router-dom';
import Cookie from 'js-cookie';
import '../styles/IdeaBox.css';
import { axiosApiInstance } from '../helper.js';


class IdeaBox extends Component {
  constructor(props){
    super(props);
    this.state = {
      idea: props.idea,
      boxStyle: props.boxStyle //can be full, normal, or condensed(just showing the title)
    }
  }

  render() {
    const idea = this.state.idea;
    return (
      <div id={idea._id} key={idea._id} className={`ideaBox ${this.state.boxStyle}`}>
        <div className="likeSection">
          <i className="fa fa-thumbs-up likeButton ratingButton" aria-hidden="true"></i>
          <i class="fa fa-thumbs-down dislikeButton ratingButton" aria-hidden="true"></i>
        </div>
        <div className="ideaBoxContents">
          <div className="ideaBoxUpper">
            <Link to={`/idea/${idea._id}`} id="titleLink">
              <h1>{idea.title}</h1>
            </Link>
            <OwnerFeatures idea={idea} creator={idea.creator} ideaId={idea._id}/>
          </div>
          <ReactMarkdown className="ideaDetails">
            {idea.details}
          </ReactMarkdown >
          <Tags idea={idea}/>
          <p className="ideaBoxCreator">Created by: <Link to={`/${idea.creator}`}>{idea.creator}</Link></p>
        </div>
      </div>
    );
  }
}

function OwnerFeatures(props) {
  function deleteIdea() {
    axiosApiInstance.delete(`/api/delete_idea/${props.ideaId}`
    ).then(response => {
      //if success, hide the ideaBox
      document.getElementById(props.ideaId).innerHTML = "Idea \"" + props.idea.title + "\" deleted";
    }).catch(error => {
      console.log("Deletion failed");
    });
  }
  const username = Cookie.get("username") ? Cookie.get("username") : null;
  if (username === props.creator) {
    return(
      <div className="ownerFeatures">
        <Link to={`/editIdea/${props.ideaId}`} className="editIdeaLink">Edit idea</Link>
        <p className="deleteIdea" onClick={() => {deleteIdea()}}>Delete Idea</p>
      </div>
    );
  } else {
    return(
      <div className="creatorFeatures"></div>
    );
  }
}

export default IdeaBox;
