import React, { Component } from "react";
import { Link } from 'react-router-dom';
import axiosApiInstance from '../helper.js';
import '../styles/Comments.css';

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ideaId: props.ideaId,
      comments: props.comments
    }
  }

  addComment = (comment) => {
    let tempComments = this.state.comments === undefined ? [] : this.state.comments;
    tempComments.push(comment);
    this.setState({comments: tempComments})
  }

  render() {
    if (this.state.comments !== undefined) {
      return(
        <div id="comments" className="comments normalBox">
          <h2>Comments</h2>
          <NewComment
            ideaId={this.state.ideaId}
            parentIds={[]}
            addComment={this.addComment} />
          {(this.state.comments).map((comment, index) => (
            <Comment
              ideaId={this.state.ideaId}
              comment={comment}
              parentIds={[]} />
          ))}
        </div>
      );
    }
    else {
      return(
        <div className="comments normalBox">
          <h2>Comments</h2>
          <NewComment
            ideaId={this.state.ideaId}
            parentIds={[]}
            addComment={this.addComment} />
          No comments
        </div>
      )
    }
  }
}

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ideaId: props.ideaId,
      comment: props.comment,
      inputVisible: false,
      parentIds: props.parentIds,
    }
  }

  addComment = (comment) => {
    let tempComment = this.state.comment;
    if (tempComment.replies) {
      tempComment.replies.push(comment);
    } else {
      tempComment.replies = [comment];
    }
    this.setState({comment: tempComment})
  }

  hideInput = () => {
    this.setState({inputVisible: !this.state.inputVisible});
  }

  render() {
    let comment = this.state.comment;
    if (comment.replies == null) comment.replies = [];
    const renderInput = () => {
      if (this.state.inputVisible) {
        return <NewComment
          ideaId={this.state.ideaId}
          parentIds={this.state.parentIds.concat(this.state.comment._id)}
          addComment={this.addComment}
          hideInput={this.hideInput}/>
      } else {
        return <div></div>
      }
    }
    return(
      <div className="comment" key={comment.comment}> {//key should be comment._id
      }
        <Link to={`/${comment.user}`} className="commentUsername">{comment.user}</Link>
        <br/>
        <div className="commentString">
          <div className="commentStringLeft"></div>
          <div className="commentStringRight">
            {comment.comment}
            <div className="commentActions">
              <p className="a" onClick={() => {
                this.setState({inputVisible: !this.state.inputVisible});
              }}>Reply</p>
            </div>
            <div>
              {(comment.replies).map((comment, index) => (
                <Comment
                  ideaId={this.state.ideaId}
                  comment={comment}
                  parentIds={this.state.parentIds.concat(this.state.comment._id)}/>
              ))}
            </div>
            {renderInput()}
          </div>
        </div>
      </div>
    );
  }
}


class NewComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ideaId: props.ideaId,
      commentInput: "",
      parentIds: props.parentIds //id of the parent comment, empty if no parent
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.submitComment = this.submitComment.bind(this);
  }
  //parent is list of id's  leading up to this comments parent
  //list will be empty if comment is replying to the idea directly
  //parents = [first_id, second_id, third_id, final_id]
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  }

  async submitComment(event) {
    event.preventDefault();
    axiosApiInstance.post('/api/add_comment', {
      ideaId: this.state.ideaId,
      parentIds: this.state.parentIds,
      commentContent: this.state.commentInput,
    }).then(() => {
      let newCommentObj = { user: "lukew3", comment: this.state.commentInput }
      this.props.addComment(newCommentObj);
      this.setState({commentInput: ""})
      if (this.props.hideInput) {
        this.props.hideInput();
      }
    })
  }

  render() {
    return(
      <div className="newCommentGroup">
        <form onSubmit={this.submitComment}>
          <textarea
            type="text"
            name="commentInput"
            className="newCommentInput"
            placeholder="What are your thoughts..."
            value={this.state.commentInput}
            onChange={this.handleInputChange}/>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default Comments;