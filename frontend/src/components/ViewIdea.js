import React, { Component } from "react";
import axios from 'axios';
import IdeaBox from './IdeaBox.js';
//import Cookie from 'js-cookie';

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      ideaId: props.match.params.ideaId,
      idea: {}
    }
  }
  // on mount, load subscriptions
  componentDidMount() {
    const urlbase = 'http://127.0.0.1:5001';
    axios.get(`${urlbase}/api/get_idea/${this.state.ideaId}`, {}).then(response => {
      this.setState({ idea: response.data.idea });
    });
  }

  render() {
    const idea = this.state.idea;
    return (
      <div key={idea._id}>
        <IdeaBox idea={idea} />
      </div>
    );
  }
}

export default Home;
