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
    const domain = "127.0.0.1";
    await axios.get(`${domain}/api/get_ideas`).then(response => {
      console.log(response);
      this.setState({ ideasList: response.data.data});
      console.log(this.state.ideasList);
    });
  }

  render() {
    return (
      <div>
        <h1>Idea Homepage</h1>
        <h2>Ideas</h2>
        {this.state.ideasList.map(idea => (
        <Link to={`/idea/${idea._id}`} key={idea._id}>
        <div key={idea._id} className='boxContainer'>
          <h2>{idea.title}</h2>
          <p>{idea.content}</p>
        </div>
        </Link>
      ))}
      </div>
    );
  }
}

export default Home;
