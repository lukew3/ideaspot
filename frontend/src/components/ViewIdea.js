import React, { Component } from "react";
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import Tags from './Tags.js';
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
      this.setState({ idea: response.data.idea });
    });
  }

  render() {
    const idea = this.state.idea;
    return (
      <div className="ideaBox">
        <h1>{idea.title}</h1>
        <ReactMarkdown >
          {idea.details}
        </ReactMarkdown >
        <Tags idea={idea}/>
      </div>
    );
  }
}

export default Home;
