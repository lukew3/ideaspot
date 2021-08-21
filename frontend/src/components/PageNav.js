import React, { Component } from "react";
import { pageArrowRight, doublePageArrowRight} from '../svg/index.js';

class PageNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: props.page,
      setPage: props.setPage
    }
  }

  render() {
    return (
      <div className="pageControl">
        <img
          src={doublePageArrowRight}
          className="a reverse pageButton"
          alt="firstPage"
          onClick={() => {this.state.setPage(1)}}
        />
        <img
          src={pageArrowRight}
          className="a reverse pageButton"
          alt="previousPage"
          onClick={() => {this.state.setPage(this.state.page-1)}}
        />
        <p className='a'>{this.state.page}</p>
        <img
          src={pageArrowRight}
          className="a pageButton"
          alt="nextPage"
          onClick={() => {console.log(this.state.page+1); this.state.setPage(this.state.page+1)}}
        />
        <img
          src={doublePageArrowRight}
          className="a pageButton"
          alt="lastPage"
          onClick={() => {this.state.setPage(this.state.maxPage)}}
        />
      </div>
    )
  }
}

export default PageNav;
