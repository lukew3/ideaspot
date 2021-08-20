import React, { Component } from "react";
import axiosApiInstance from '../helper.js';
import { IdeaBox, ControlBar } from '../components/index.js';
import { pageArrowRight, doublePageArrowRight} from '../svg/index.js';
import queryString from 'query-string';


class Home extends Component {
  constructor(props){
    super(props);
    let qsPage = queryString.parse(this.props.location.search).page;
    this.state = {
      ideasList: [],
      page: qsPage === undefined ? 1 : qsPage,
      maxPage: 1
    }
  }
  // on mount, load subscriptions
  componentDidMount() {
    axiosApiInstance.get(`/api/get_ideas?page=${this.state.page}`, {}).then(response => {
      this.setState({ ideasList: response.data.ideas, maxPage: response.data.maxPage });
    });
  }

  setPage(pageNum) {
    if (pageNum < 1) return;
    if (pageNum > this.state.maxPage) return;
    axiosApiInstance.get(`/api/get_ideas?page=${pageNum}`).then((response) => {
      this.setState({page: pageNum, ideasList: response.data.ideas});
    })
    this.props.history.push(`/?page=${pageNum}`)
    window.scrollTo(0, 0);
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
            onClick={() => {this.setPage(this.state.maxPage)}}
          />
        </div>
      </div>
    );
  }
}

export default Home;
