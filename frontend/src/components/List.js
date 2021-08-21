import React, { Component } from "react";
import { IdeaBox, ControlBar } from './index.js';
import axiosApiInstance from '../helper.js';
import { pageArrowRight, doublePageArrowRight} from '../svg/index.js';
import queryString from 'query-string';


class List extends Component {
  constructor(props){
    super(props);
    let qsPage = parseInt(queryString.parse(this.props.location.search).page);
    this.state = {
      ideasList: props.idea,
      page: isNaN(qsPage) ? 1 : qsPage,
      getPage: props.getPage, //This is a function that calls axios to get the requested ideas
      maxPage: 1,
    }
    this.setPage = this.setPage.bind(this);
  }

  setPage(pageNum) {
    if (pageNum < 1) return;
    if (pageNum > this.state.maxPage) return;
    this.state.getPage(pageNum)
    /*
    axiosApiInstance.get(`/api/get_ideas?page=${pageNum}`).then((response) => {
      this.setState({page: pageNum, ideasList: response.data.ideas});
    })
    */
    this.props.history.push(`/?page=${pageNum}`)
    window.scrollTo(0, 0);
  }

  render() {
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
            onClick={() => {console.log(this.state.page+1); this.setPage(this.state.page+1)}}
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


export default List;
