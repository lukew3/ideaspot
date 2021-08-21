import React, { Component } from "react";
import axiosApiInstance from '../helper.js';
import { ControlBar, IdeaBox, List } from '../components/index.js';


class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      ideasList: [],
      page: isNaN(qsPage) ? 1 : qsPage,
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
      <List ideasList={this.state.ideasList} route="/api/get_ideas"/>
    );
  }
}

export default Home;
