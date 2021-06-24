import React, { Component } from "react";
import ReactMarkdown from 'react-markdown';
import Tags from './Tags.js';
import { Link } from 'react-router-dom';
import Cookie from 'js-cookie';
import '../styles/IdeaBox.css';
import { axiosApiInstance } from '../helper.js';
import arrowUp from '../svg/arrow-up.svg';
import arrowDown from '../svg/arrow-down.svg';
import arrowUpActive from '../svg/arrow-up-active.svg';
import arrowDownActive from '../svg/arrow-down-active.svg';

class IdeaBox extends Component {
  constructor(props){
    super(props);
    this.state = {
      idea: props.idea,
      boxStyle: props.boxStyle, //can be full, normal, or condensed(just showing the title)
      liked: props.idea.liked,
      disliked: props.idea.disliked,
      score: props.idea.likeCount-props.idea.dislikeCount,
      boost: 0
    }
    this.likeIdea = this.likeIdea.bind(this);
    this.dislikeIdea = this.dislikeIdea.bind(this);
  }

  likeIdea() {
    if (this.state.liked === false) { //this prevents sending requests when the idea is already liked
      axiosApiInstance.post(`/api/like_idea`, {"ideaId": this.state.idea._id}).then(() => {
        if (this.state.disliked) {
          this.setState({ score: this.state.score + 1});
        }
        this.setState({ liked: true, disliked: false, score: this.state.score + 1 })
      }).catch(error => {
        console.log(error);
        console.log("must be logged in to rate ideas");
        window.location.href = "https://buildmyidea.tk/login";
      });
    } else {
      axiosApiInstance.post(`/api/remove_idea_like`, {"ideaId": this.state.idea._id}).then(() => {
        this.setState({ liked: false, disliked: false, score: this.state.score - 1})
      }).catch(error => {
        window.location.href = "https://buildmyidea.tk/login";
      });
    }
  }

  dislikeIdea() {
    if (this.state.disliked === false) {
      axiosApiInstance.post(`/api/dislike_idea`, {"ideaId": this.state.idea._id}).then(() => {
        if (this.state.liked) {
          this.setState({ score: this.state.score - 1});
        }
        this.setState({ disliked: true, liked: false, score: this.state.score - 1})
      }).catch(error => {
        window.location.href = "https://buildmyidea.tk/login";
      });
    } else {
      axiosApiInstance.post(`/api/remove_idea_dislike`, {"ideaId": this.state.idea._id}).then(() => {
        this.setState({ disliked: false, liked: false, score: this.state.score + 1})
      }).catch(error => {
        window.location.href = "https://buildmyidea.tk/login";
      });
    }
  }

  render() {
    const idea = this.state.idea;
    const renderUpArrow = () => {
      if (this.state.liked === true) {
        return <img className="upArrowActive" alt = "Active up arrow" src={arrowUpActive} onClick={this.likeIdea}/>;
      } else {
        return <img src={arrowUp} alt="Inactive up arrow" onClick={this.likeIdea}/>;
      }
    }
    const renderDownArrow = () => {
      if (this.state.disliked === true) {
        return <img className="downArrowActive" alt="Active down arrow" src={arrowDownActive} onClick={this.dislikeIdea}/>;
      } else {
        return <img src={arrowDown} alt="Inactive down arrow" onClick={this.dislikeIdea}/>;
      }
    }
    return (
      <div id={idea._id} key={idea._id} className={`ideaBox ${this.state.boxStyle}`}>
        <div className="ideaBoxLeft">
          <p className="ratingLabel ideaBoxLeftLabel">Rating</p>
          <div className="voting">
            {renderDownArrow()}
            <p className="ideaBoxScore">{this.state.score}</p>
            {renderUpArrow()}
          </div>
          {
            //<h3 className="boostLabel ideaBoxLeftLabel">Boost</h3>
            //<p>10</p>
            //<p className="giveBoostButton">Give boost</p>
          }

          {
          //<div className="thumbs">
          //  <i className={`fa fa-thumbs-up likeButton ratingButton ${likedClass}`} aria-hidden="true" onClick={this.likeIdea}></i>
          //  <i className={`fa fa-thumbs-down dislikeButton ratingButton ${dislikedClass}`} aria-hidden="true" onClick={this.dislikeIdea}></i>
          //</div>
          }
          {
          //<p>Boost: {this.state.boost}</p>
          //<p style={{"background-color": "orange"}}>Give boost</p>
          }
        </div>
        <div className="seperator"></div>
        <div className="ideaBoxRight">
          <div className="ideaBoxUpper">
            <Link to={`/idea/${idea._id}`} id="titleLink">
              <h1 className="ideaBoxTitle">{idea.title}</h1>
            </Link>
            <p>{idea.revisionTime}</p>
            <OwnerFeatures idea={idea} creator={idea.creator} ideaId={idea._id}/>
          </div>
          <ReactMarkdown className="ideaDescription">
            {idea.description}
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
