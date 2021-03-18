import React, { Component } from "react";
import axios from 'axios';
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
    axios.get(`/api/get_ideas`, {}).then(response => {
      this.setState({ ideasList: response.data.ideas });
    });
  }

  render() {
    return (
      <div className="ideaFeed">
        {this.state.ideasList.map((idea, index) => (
          <IdeaBox key={idea._id} idea={idea} />
        ))}
      </div>
    );
  }
}

export default Home;
