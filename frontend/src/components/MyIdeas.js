import React, { Component } from "react";
import axios from 'axios';
import IdeaBox from './IdeaBox.js';
import { getToken } from '../helper.js';


class MyIdeas extends Component {
  constructor(props){
    super(props);
    this.state = {
      ideasList: [{}]
    }
  }
  // on mount, load subscriptions
  componentDidMount() {
    getToken().then((token) => {
      axios.get(`/api/get_my_ideas`,
        { headers: { Authorization: `Bearer ${token}` }}
      ).then(response => {
        this.setState({ ideasList: response.data.ideas });
      }).catch(error => {
        this.props.history.push(`/login`);
      });
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

export default MyIdeas;
