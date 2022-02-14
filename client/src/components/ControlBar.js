import React, { Component } from "react";
import '../styles/ControlBar.css';

class ControlBar extends Component {
  constructor(props){
    super(props);
    this.state = {

    }
    this.switchSort = this.switchSort.bind(this);
    this.switchStyle = this.switchStyle.bind(this);
  }

  switchSort() {}

  switchStyle() {}

  render() {
    return (
      <div className="controlBar">
        <div className="innerControlBar">
          <div className="controlBarSort controlBarSection">
            <p>Sort by: </p>
            <select className="controlBarSelect revisionSelect">
              <option>Newest</option>
              <option>Highest Rating</option>
            </select>
            {/*
            <select>
              <option>Ascending</option>
              <option>Descending</option>
            </select>
            */}
          </div>
          <div className="controlBarDivider"></div>
          <div className="controlBarStyle controlBarSection">
            <p>Style:</p>
            <select className="controlBarSelect revisionSelect">
              <option>Normal</option>
              <option>Compressed</option>
            </select>
          </div>
          <div className="controlBarDivider"></div>
          <div className="controlBarStyle controlBarSection">
            <p>View:</p>
            <select className="controlBarSelect revisionSelect">
              <option>Paginate</option>
              <option>Infinite Scroll</option>
            </select>
          </div>
        </div>
      </div>
    );
  }
}

export default ControlBar;
