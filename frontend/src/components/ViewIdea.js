import React, { Component } from "react";
import IdeaBox from './IdeaBox.js';
import { axiosApiInstance } from '../helper.js';


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
    axiosApiInstance.get(`/api/get_idea/${this.state.ideaId}`
    ).then(response => {
      this.setState({ idea: response.data.idea });
    }).catch(error => {
      console.log("Login invalid");
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
