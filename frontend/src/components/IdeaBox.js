import React, { Component } from "react";
import ReactMarkdown from 'react-markdown';
import { Tags, VotingSection } from './index.js';
import { Link } from 'react-router-dom';
import Cookie from 'js-cookie';
import '../styles/IdeaBox.css';
import axiosApiInstance from '../helper.js';
import { optionsButton } from '../svg/index.js';

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
    this.switchRevision = this.switchRevision.bind(this);
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
          idea={this.state.idea}
          hideScore={this.state.hideScore} />
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

function RevisionSelect(props) {
  try {
    if (props.revs.length === 1) {
      //should just make a div that looks like the select field without arrow and dropdown
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
          <p className="a deleteIdeaLink" onClick={() => {deleteIdea()}}>Delete Idea</p>
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
