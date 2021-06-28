import React, { Component } from "react";
import { axiosApiInstance } from '../helper.js';
import { arrowUp, arrowDown, arrowUpActive, arrowDownActive } from '../svg/index.js';


class VotingSection extends Component {
  constructor(props){
    super(props);
    this.state = {
      idea: props.idea,
      liked: props.idea.liked,
      disliked: props.idea.disliked,
      score: props.idea.likeCount-props.idea.dislikeCount,
      boost: 0,
      hideScore: props.hideScore,
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
    if (this.state.hideScore == true) return <div></div>
    const renderUpArrow = () => {
      if (this.state.liked === true) {
        return <img className="upArrowActive upArrow" alt="Active up arrow" src={arrowUpActive} onClick={this.likeIdea}/>;
      } else {
        return <img src={arrowUp} className="upArrow" alt="Inactive up arrow" onClick={this.likeIdea} />;
      }
    }
    const renderDownArrow = () => {
      if (this.state.disliked === true) {
        return <img className="downArrowActive downArrow" alt="Active down arrow" src={arrowDownActive} onClick={this.dislikeIdea}/>;
      } else {
        return <img src={arrowDown} className="downArrow" alt="Inactive down arrow" onClick={this.dislikeIdea}/>;
      }
    }
    return (
      <div style={{"display": "flex"}}>
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
      </div>
    )
  }
}

export default VotingSection;
