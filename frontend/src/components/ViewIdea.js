import React, { Component } from "react";
import axios from 'axios';
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
  async componentDidMount() {
    await axios.get(`/api/get_idea/${this.state.ideaId}`, {}).then(response => {
      console.log(response);
      this.setState({ idea: response.data.idea });
    });
  }

  render() {
    return (
      <div className="viewIdeaBox homeIdeaBox">
        <h1>{this.state.idea.title}</h1>
        <p>{this.state.idea.details}</p>
      </div>
    );
  }
}

export default Home;
