import React, { Component } from "react";
import { axiosApiInstance } from '../helper.js';
import IdeaBox from './IdeaBox.js';


class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      ideasList: [{}]
    }
  }
  // on mount, load subscriptions
  componentDidMount() {
    axiosApiInstance.get(`/api/get_ideas`, {}).then(response => {
      this.setState({ ideasList: response.data.ideas });
    });
  }

  render() {
    if (this.state.ideasList.length === 0) {
      return (
        <div className="blankPageTextContainer">
          <h2>
            No Ideas?
          </h2>
          <p>Where are they?</p>
        </div>
      )
    }
    return (
      <div className="ideaFeed">
        {this.state.ideasList.map((idea, index) => (
          <IdeaBox key={idea._id} idea={idea} boxStyle="normal"/>
        ))}
      </div>
    );
  }
}

export default Home;
