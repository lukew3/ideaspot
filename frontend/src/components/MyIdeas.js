import React, { Component } from "react";
import axios from 'axios';
import Cookie from 'js-cookie';
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
    const token = Cookie.get("token") ? Cookie.get("token") : null;
    const urlbase = 'localhost:5001';
    axios.get(`${urlbase}/api/get_my_ideas`,
      { headers: { Authorization: `Bearer ${token}` }}
    ).then(response => {
      this.setState({ ideasList: response.data.ideas });
    }).catch(error => {
      this.props.history.push(`/login`);
      console.log(error);
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
