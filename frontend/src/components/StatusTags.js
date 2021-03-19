import React, { Component } from "react";
import '../styles/Tags.css';

class StatusTags extends Component {
  constructor(props){
    super(props);
    this.state = {
      status: props.status
    }
  }

  render() {
    return (
      <div className="statusTagsContainer">
        <div className="statusTag interested">Interested</div>
        <div className="statusTag planning">Planning on building</div>
        <div className="statusTag building">Building now</div>
      </div>
    );
  }
}


export default StatusTags;
