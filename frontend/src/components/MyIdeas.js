import React, { Component } from "react";
import IdeaBox from './IdeaBox.js';
//import { getToken } from '../helper.js';
import { axiosApiInstance } from '../helper.js';


class MyIdeas extends Component {
  constructor(props){
    super(props);
    this.state = {
      ideasList: [{}]
    }
  }
  // on mount, load subscriptions
  componentDidMount() {
    axiosApiInstance.get(`/api/get_my_ideas`).then(response => {
      this.setState({ ideasList: response.data.ideas });
    }).catch(error => {
      this.props.history.push(`/login`);
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
