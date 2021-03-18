import React, { Component } from "react";
import axios from 'axios';
import IdeaBox from './IdeaBox.js';
import { getToken } from '../helper.js';


class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      ideasList: [{}]
    }
  }
  // on mount, load subscriptions
  componentDidMount() {
    axios.get(`/api/get_my_ideas`,
      { headers: { Authorization: `Bearer ${getToken()}` }}
    ).then(response => {
      this.setState({ ideasList: response.data.ideas });
    }).catch(error => {
      this.props.history.push(`/login`);
    });
  }

  render() {

    return (
      <div className="ideaFeed">
        {this.state.ideasList.map(idea => (
          <IdeaBox idea={idea} key={idea._id}/>
        ))}
      </div>
    );
  }
}

export default Home;
