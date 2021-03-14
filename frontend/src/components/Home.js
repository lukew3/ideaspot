import React, { Component } from "react";
import axios from 'axios';
//import Cookie from 'js-cookie';
import {Link} from 'react-router-dom';
import Tags from './Tags.js';
import ReactMarkdown from 'react-markdown';

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
        <div key={idea._id} className='ideaBox'>
          <h2>{idea.title}</h2>
          <ReactMarkdown >
            {idea.details}
          </ReactMarkdown >
          <Tags idea={idea}/>
        </div>
        </Link>
      ))}
      </div>
    );
  }
}

export default Home;
