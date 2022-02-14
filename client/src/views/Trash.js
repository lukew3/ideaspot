import React, { Component } from "react";
import axiosApiInstance from '../helper.js';
import { IdeaBox } from '../components/index.js';


class Trash extends Component {
  constructor(props){
    super(props);
    this.state = {
      ideasList: []
    }
  }
  // on mount, load subscriptions
  componentDidMount() {
    axiosApiInstance.get(`/api/get_trash`, {}).then(response => {
      this.setState({ ideasList: response.data.ideas });
    });
  }

  deleteForever() {
    axiosApiInstance.delete('/api/delete_idea/')
  }

  render() {
    if (this.state.ideasList.length === 0) {
      return (
        <div className="blankPageTextContainer">
          <h2>
            Apparently you don't make any mistakes...
          </h2>
          <p>Your trash is empty</p>
        </div>
      )
    }
    return (
      <div className="ideaFeed">
        {this.state.ideasList.map((idea, index) => (
          <div className="ideaBox" id={"trash" + idea._id}>
            <div style={{ "display": "block"}}>
              <p>Deleting on {idea.delete_date}:</p>
              <p className="a" onClick={() => {
                axiosApiInstance.post(`/api/restore_idea/${idea._id}`).then(() => {
                  document.getElementById(`trash${idea._id}`).innerHTML = "Idea restored";
                })
              }}>Restore</p>
              <br style={{"margin-bottom": "10px"}}></br>
              <p className="a" onClick={() => {
                axiosApiInstance.delete(`/api/delete_idea/${idea._id}`).then(() => {
                  document.getElementById(`trash${idea._id}`).innerHTML = "Idea deleted";
                })
              }}>Delete forever</p>
            </div>
            <IdeaBox key={idea._id} idea={idea} hideOptions={true} boxStyle="normal"/>
          </div>
        ))}
      </div>
    )
  }
}

export default Trash;
