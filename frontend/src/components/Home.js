import React, { Component } from "react";
import { axiosApiInstance } from '../helper.js';
import IdeaBox from './IdeaBox.js';


class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      ideasList: [{}],
      page: 1,
    }
    this.loadMoreIdeas = this.loadMoreIdeas.bind(this);

  }
  // on mount, load subscriptions
  componentDidMount() {
    axiosApiInstance.get(`/api/get_ideas`, {}).then(response => {
      this.setState({ ideasList: response.data.ideas });
    });
  }

  loadMoreIdeas() {
    axiosApiInstance.get(`/api/get_ideas?page=${this.state.page+1}`).then((response) => {
      let tempIdeasList = this.state.ideasList;
      response.data.ideas.forEach((idea) => {
        tempIdeasList.push(idea);
      });
      this.setState({ ideasList: tempIdeasList, page: this.state.page+1 });
    }).catch((e) => {
      console.log(e);
      document.getElementById("loadMoreButton").style.display = "none";
    })
  }

  render() {
    if (this.state.ideasList.length === 0) {
      return (
        <div className="blankPageTextContainer">
          <h2>
            No Ideas?
          </h2>
          <p>Where are they?</p>
        </div>
      )
    }
    return (
      <div className="ideaFeed">
        {this.state.ideasList.map((idea, index) => (
          <IdeaBox key={idea._id} idea={idea} boxStyle="normal"/>
        ))}
        <button className="loadMoreButton"
                id="loadMoreButton"
                style={{"margin-left": "calc(50vw - 50px)"}}
                onClick={this.loadMoreIdeas}>Load More</button>
      </div>
    );
  }
}

export default Home;
