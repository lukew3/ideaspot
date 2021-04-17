import React, { Component } from "react";
import ReactMarkdown from 'react-markdown';
import Tags from './Tags.js';
import { Link, Redirect } from 'react-router-dom';
import Cookie from 'js-cookie';
import '../styles/IdeaBox.css';
import { axiosApiInstance } from '../helper.js';


class IdeaBox extends Component {
  constructor(props){
    super(props);
    this.state = {
      idea: props.idea,
      boxStyle: props.boxStyle, //can be full, normal, or condensed(just showing the title)
      liked: props.idea.liked,
      disliked: props.idea.disliked
    }
    this.likeIdea = this.likeIdea.bind(this);
    this.dislikeIdea = this.dislikeIdea.bind(this);
  }

  likeIdea() {
    axiosApiInstance.post(`/api/like_idea`, {"ideaId": this.state.idea._id}).then(
      this.setState({ liked: true, disliked: false })
    ).catch(error => {
      console.log(error);
      console.log("must be logged in to rate ideas");
    });
  }

  dislikeIdea() {
    axiosApiInstance.post(`/api/dislike_idea`, {"ideaId": this.state.idea._id}).then(
      this.setState({ disliked: true, liked: false })
    ).catch(error => {
      console.log(error);
      console.log("must be logged in to rate ideas");
    });
  }

  render() {
    const idea = this.state.idea;
    let likedClass = "ratingFalse";
    if (this.state.liked == true) {
      likedClass = "ratingTrue"
    }
    let dislikedClass = "ratingFalse";
    if (this.state.disliked == true) {
      dislikedClass = "ratingTrue";
    }
    return (
      <div id={idea._id} key={idea._id} className={`ideaBox ${this.state.boxStyle}`}>
        <div className="likeSection">
          <i className={`fa fa-thumbs-up likeButton ratingButton ${likedClass}`} aria-hidden="true" onClick={this.likeIdea}></i>
          <i class={`fa fa-thumbs-down dislikeButton ratingButton ${dislikedClass}`} aria-hidden="true" onClick={this.dislikeIdea}></i>
        </div>
        <div className="ideaBoxContents">
          <div className="ideaBoxUpper">
            <Link to={`/idea/${idea._id}`} id="titleLink">
              <h1 className="ideaBoxTitle">{idea.title}</h1>
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
