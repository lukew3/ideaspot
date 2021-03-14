import React, { Component } from "react";
import axios from 'axios';
//import Cookie from 'js-cookie';
import {Link} from 'react-router-dom';
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
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTYxNTcwMjkzNCwianRpIjoiZTBkNWY1ZjYtMDU0Ni00MWI2LWIwODAtMmZlYmQ4ODcyN2M0IiwibmJmIjoxNjE1NzAyOTM0LCJ0eXBlIjoiYWNjZXNzIiwic3ViIjoibHVrZXczIiwiZXhwIjoxNjE1NzAzODM0fQ.12A_s6UuFIyJ_kJm6QXFiwkgbt14XDbiKSY_idRJKTI";
    axios.get(`/api/get_my_ideas`,
      { headers: { Authorization: `Bearer ${token}` }}
    ).then(response => {
      this.setState({ ideasList: response.data.ideas });
    });
  }

  render() {

    return (
      <div className="ideaFeed">
        {this.state.ideasList.map(idea => (
        <Link to={`/idea/${idea._id}`} key={idea._id}>
          <IdeaBox idea={idea} />
        </Link>
      ))}
      </div>
    );
  }
}

export default Home;
