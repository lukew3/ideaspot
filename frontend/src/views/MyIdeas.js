import React, { Component } from "react";
import { IdeaBox, ControlBar } from '../components/index.js';
//import { getToken } from '../helper.js';
import axiosApiInstance from '../helper.js';


class MyIdeas extends Component {
  constructor(props){
    super(props);
    this.state = {
      ideasList: []
    }
  }
  // on mount, load subscriptions
  componentDidMount() {
    axiosApiInstance.get(`/api/get_my_ideas`).then(response => {
      this.setState({ ideasList: response.data.ideas });
    }).catch(error => {
      this.props.history.push(`/login`);
    });
  }

  render() {
    if (this.state.ideasList.length === 0) {
      return (
        <div className="blankPageTextContainer">
          <h2>
            Loading Ideas...
          </h2>
        </div>
      )
    }
    return (
      <div className="ideaFeed">
        <ControlBar />
        {this.state.ideasList.map((idea, index) => (
          <IdeaBox key={idea._id} idea={idea} boxStyle="normal"/>
        ))}
      </div>
    );
  }
}

export default MyIdeas;
