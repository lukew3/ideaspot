import React, { Component } from "react";
import ReactMarkdown from 'react-markdown';
import Tags from './Tags.js';
import { Link } from 'react-router-dom';

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
        <Link to={`/editIdea/${idea._id}`}>Edit idea</Link>
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

export default IdeaBox;
