import React, { Component } from "react";
import axiosApiInstance from '../helper.js';
import { IdeaBox, ControlBar } from '../components/index.js';
import { pageArrowRight, doublePageArrowRight} from '../svg/index.js';


class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      ideasList: [],
      page: 1,
      maxPage: 1
    }
    this.loadMoreIdeas = this.loadMoreIdeas.bind(this);

  }
  // on mount, load subscriptions
  componentDidMount() {
    axiosApiInstance.get(`/api/get_ideas`, {}).then(response => {
      this.setState({ ideasList: response.data.ideas, maxPage: response.data.maxPage });
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

  setPage(pageNum) {
    if (pageNum < 1) return;
    if (pageNum > this.state.maxPage) return;
    axiosApiInstance.get(`/api/get_ideas?page=${pageNum}`).then((response) => {
      this.setState({page: pageNum, ideasList: response.data.ideas});
    })
  }

  render() {
    if (this.state.ideasList.length === 0) {
      return (
        <div className="blankPageTextContainer">
          <h2>
            Loading Ideas...
          </h2>
        </div>
      )
    }
    return (
      <div className="ideaFeed">
        {
          //<ControlBar />
        }
        {this.state.ideasList.map((idea, index) => (
          <IdeaBox key={idea._id} idea={idea} boxStyle="normal"/>
        ))}
        <div className="pageControl">
          <img
            src={doublePageArrowRight}
            className="a reverse pageButton"
            alt="firstPage"
            onClick={() => {this.setPage(1)}}
          />
          <img
            src={pageArrowRight}
            className="a reverse pageButton"
            alt="previousPage"
            onClick={() => {this.setPage(this.state.page-1)}}
          />
          <p className='a'>{this.state.page}</p>
          <img
            src={pageArrowRight}
            className="a pageButton"
            alt="nextPage"
            onClick={() => {this.setPage(this.state.page+1)}}
          />
          <img
            src={doublePageArrowRight}
            className="a pageButton"
            alt="lastPage"
            onClick={() => {this.setPage(10)}}
          />
        </div>
      </div>
    );
  }
}

export default Home;
