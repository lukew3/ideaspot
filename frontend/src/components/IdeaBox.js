import React, { Component } from "react";
import ReactMarkdown from 'react-markdown';
import Tags from './Tags.js';
import { Link } from 'react-router-dom';
import Cookie from 'js-cookie';

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
      <div className="ideaBox">
        <OwnerFeatures creator={idea.creator} ideaId={idea._id}/>
        <h1>{idea.title}</h1>
        <ReactMarkdown >
          {idea.details}
        </ReactMarkdown >
        <Tags idea={idea}/>
        <p className="ideaBoxCreator">Created by: <Link to={`/user/${idea.creator}`}>{idea.creator}</Link></p>
      </div>
    );
  }
}

function OwnerFeatures(props) {
  const username = Cookie.get("username") ? Cookie.get("username") : null;
  if (username === props.creator) {
    return(
      <div className="creatorFeatures">
        <Link to={`/editIdea/${props.ideaId}`} className="editIdeaLink">Edit idea</Link>
      </div>
    );
  } else {
    return(
      <div className="creatorFeatures"></div>
    );
  }
}

export default IdeaBox;
