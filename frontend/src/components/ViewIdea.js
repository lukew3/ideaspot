import React, { Component } from "react";
import IdeaBox from './IdeaBox.js';
import { axiosApiInstance } from '../helper.js';
import { Link } from 'react-router-dom';


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
  /*
  addCommentLocal = (user, comment) => {
    console.log("Adding COMMENT")
    const new_comment = '<div className="comment standardBorder">' +
        comment + '<br/>' +
        `<Link to={'/${user}'}>${user}</Link>` +
        '</div>';
    document.getElementsByClassName('commentsSection').innerHTML += new_comment;
    console.log(document.getElementsByClassName('commentsSection').innerHTML)
  }
  */

  render() {
    const idea = this.state.idea;
    //next four lines are annoying, but it was the workaround that I found
    let comments = [];
    for (let i in idea.comments)
      comments.push(idea.comments[i]);
    comments.reverse();
    return (
      <div key={idea._id}>
        <IdeaBox idea={idea} boxStyle="full"/>
        {//<NewComment idea={idea} addCommentLocal={this.addCommentLocal}/>
        }
        <div className="commentsSection">
          {(comments).map((comment, index) => (
            <div className="comment standardBorder" key={index}>
              {comment.comment}
              <br/>
              <Link to={`/${comment.user}`}>{comment.user}</Link>
            </div>
          ))}
        </div>
      </div>
    );
  }
}


class NewComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idea: props.idea,
      commentContent: ''
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    console.log(this.state.idea)
    await axiosApiInstance.post(`/api/add_comment`,
      { ideaId: this.state.idea._id,
        commentContent: this.state.commentContent }
    ).then(response => {
      this.props.addCommentLocal(response.data.user, response.data.comment);
      console.log('comment added')
    }).catch(error => {
      console.log(error)
      console.log("Login invalid");
    });
  }

  render() {
    return(
      <div className="standardBorder">
        <form onSubmit={this.handleSubmit}>
          <h3>Add a comment</h3>
          <textarea
            type="text"
            name="commentContent"
            className="createIdeaDescription"
            placeholder="What do you think?..."
            value={this.state.commentContent}
            onChange={this.handleInputChange} />
          <br/>
          <input type="submit" value="Submit"/>
        </form>
      </div>
    )
  }
}

export default ViewIdea;
