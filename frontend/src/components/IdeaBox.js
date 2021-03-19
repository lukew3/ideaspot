import React, { Component } from "react";
import ReactMarkdown from 'react-markdown';
import Tags from './Tags.js';
import { Link } from 'react-router-dom';
import Cookie from 'js-cookie';
import axios from 'axios';
import { getToken } from '../helper.js';


class IdeaBox extends Component {
  constructor(props){
    super(props);
    this.state = {
      idea: props.idea
    }
  }

  render() {
    const idea = this.state.idea;
    return (
      <div id={idea._id} key={idea._id} className="ideaBox">
        <OwnerFeatures idea={idea} creator={idea.creator} ideaId={idea._id}/>
        <Link to={`/idea/${idea._id}`} id="titleLink">
          <h1>{idea.title}</h1>
        </Link>
        <ReactMarkdown >
          {idea.details}
        </ReactMarkdown >
        <Tags idea={idea}/>
        <p className="ideaBoxCreator">Created by: <Link to={`/${idea.creator}`}>{idea.creator}</Link></p>
      </div>
    );
  }
}

function OwnerFeatures(props) {
  function deleteIdea() {
    getToken().then((token) => {
      axios.delete(`/api/delete_idea/${props.ideaId}`,
        { headers: { Authorization: `Bearer ${token}` }}
      ).then(response => {
        //if success, hide the ideaBox
        document.getElementById(props.ideaId).innerHTML = "Idea \"" + props.idea.title + "\" deleted";
      }).catch(error => {
        console.log("Deletion failed");
      });
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
