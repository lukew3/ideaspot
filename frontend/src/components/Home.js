import React, { Component } from "react";
import axios from 'axios';
//import Cookie from 'js-cookie';
import {Link} from 'react-router-dom';

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      ideasList: [{}]
    }
  }
  // on mount, load subscriptions
  async componentDidMount() {
    await axios.get(`/api/get_ideas`, {}).then(response => {
      this.setState({ ideasList: response.data.ideas });
    });
  }

  render() {
    return (
      <div className="ideaFeed">
        {this.state.ideasList.map(idea => (
        <Link to={`/idea/${idea._id}`} key={idea._id}>
        {console.log(idea._id)}
        <div key={idea._id} className='homeIdeaBox'>
          <h2>{idea.title}</h2>
          <p>{idea.details}</p>
        </div>
        </Link>
      ))}
      </div>
    );
  }
}

export default Home;
