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
    const urlbase = 'http://127.0.0.1:5001';
    axios.get(`${urlbase}/api/get_ideas`, {}).then(response => {
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
