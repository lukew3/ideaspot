import React, { Component } from "react";
import axios from 'axios';
import Cookie from 'js-cookie';
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
    const token = Cookie.get("access_token") ? Cookie.get("access_token") : null;
    axios.get(`/api/get_my_ideas`,
      { headers: { Authorization: `Bearer ${token}` }}
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
