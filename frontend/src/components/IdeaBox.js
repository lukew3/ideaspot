import React, { Component } from "react";
import ReactMarkdown from 'react-markdown';
import { Tags } from './index.js';
import { Link } from 'react-router-dom';
import Cookie from 'js-cookie';

import '../styles/IdeaBox.css';
import { axiosApiInstance } from '../helper.js';
import { arrowUp, arrowDown, arrowUpActive, arrowDownActive, optionsButton } from '../svg/index.js';

class IdeaBox extends Component {
  constructor(props){
    super(props);
    this.state = {
      idea: props.idea,
      boxStyle: props.boxStyle, //can be full, normal, or condensed(just showing the title)
      liked: props.idea.liked,
      disliked: props.idea.disliked,
      revisionTimes: props.idea.revisionTimes,
      score: props.idea.likeCount-props.idea.dislikeCount,
      boost: 0,
      hideOptions: props.hideOptions,
      hideScore: props.hideScore,
    }
    this.likeIdea = this.likeIdea.bind(this);
    this.dislikeIdea = this.dislikeIdea.bind(this);
    this.switchRevision = this.switchRevision.bind(this);
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

  switchRevision(event) {
    let revNum = event.target.value;
    axiosApiInstance.get(`/api/get_idea/${this.state.idea._id}/${revNum}`).then((response) => {
      this.setState({ idea: response.data.idea });
    });
  }

  render() {
    const idea = this.state.idea;
    return (
      <div id={idea._id} key={idea._id} className={`ideaBox ${this.state.boxStyle}`}>
        <VotingSection
          hideScore={this.state.hideScore}
          liked={this.state.liked}
          disliked={this.state.disliked}
          likeIdea={this.likeIdea}
          dislikeIdea={this.dislikeIdea}
          score={this.state.score} />
        <div className="ideaBoxRight">
          <div className="ideaBoxUpper">
            <Link to={`/idea/${idea._id}`} id="titleLink">
              <h1 className="ideaBoxTitle">{idea.title}</h1>
            </Link>
            <RevisionSelect revs={idea.revisionTimes} switchRevision={this.switchRevision}/>
            <OwnerOptions idea={idea} creator={idea.creator} ideaId={idea._id} hideOptions={this.state.hideOptions}/>
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

function VotingSection(props) {
  if (props.hideScore == true) return <div></div>
  const renderUpArrow = () => {
    if (props.liked === true) {
      return <img className="upArrowActive upArrow" alt="Active up arrow" src={arrowUpActive} onClick={props.likeIdea}/>;
    } else {
      return <img src={arrowUp} className="upArrow" alt="Inactive up arrow" onClick={props.likeIdea}/>;
    }
  }
  const renderDownArrow = () => {
    if (props.disliked === true) {
      return <img className="downArrowActive downArrow" alt="Active down arrow" src={arrowDownActive} onClick={props.dislikeIdea}/>;
    } else {
      return <img src={arrowDown} className="downArrow" alt="Inactive down arrow" onClick={props.dislikeIdea}/>;
    }
  }
  return (
    <div style={{"display": "flex"}}>
      <div className="ideaBoxLeft">
        <p className="ratingLabel ideaBoxLeftLabel">Rating</p>
        <div className="voting">
          {renderDownArrow()}
          <p className="ideaBoxScore">{props.score}</p>
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
    </div>
  )
}

function RevisionSelect(props) {
  try {
    if (props.revs.length === 1) {
      //should just make a div that looks like the select field with arrow and dropdown
      /*
      return (
        <div>
          <p>{props.revs[0]}</p>
        </div>
      )*/
    }
    return (
      <select className="revisionSelect" onChange={props.switchRevision}>
        {props.revs.slice(0).reverse().map((rev, index) => {
          return <option value={props.revs.length-1-index}>{rev}</option>;
        })}
      </select>
    )
  } catch (e) {
    return "";
  }
}

function OwnerOptions(props) {
  function deleteIdea() {
    axiosApiInstance.post(`/api/trash_idea/${props.idea._id}`
    ).then(response => {
      //if success, hide the ideaBox
      document.getElementById(props.idea._id).innerHTML = "Idea \"" + props.idea.title + "\" moved to trash. It will be deleted in 30 days unless you choose otherwise.";
    }).catch(error => {
      console.log("Deletion failed");
    });
  }
  if (props.hideOptions) return <div className="ownerOptionsContainer"></div>;
  const username = Cookie.get("username") ? Cookie.get("username") : null;
  if (username === props.creator) {
    return(
      <div className="ownerOptionsContainer">
        <img src={optionsButton} alt="Options" className="ownerOptionsButton" onClick={() => {
          if (document.getElementById(props.idea._id + "OptionsMenu").style.display === 'none') {
            document.getElementById(props.idea._id + "OptionsMenu").style.display = 'block';
          } else {
            document.getElementById(props.idea._id + "OptionsMenu").style.display = 'none';
          }
        }}/>
        <div className="ownerOptionsMenu customDropMenu" style={{"display": "none"}} id={props.idea._id + "OptionsMenu"}>
          <Link to={`/editIdea/${props.idea._id}`} className="editIdeaLink">Edit idea</Link>
          <div className="ownerOptionsMenuDivider"></div>
          <a className="deleteIdeaLink" href="#" onClick={() => {deleteIdea()}}>Delete Idea</a>
        </div>
      </div>
    );
  } else {
    return(
      <div className="ownerOptionsContainer"></div>
    );
  }
}

export default IdeaBox;
