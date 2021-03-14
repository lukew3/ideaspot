import React, { Component } from "react";
import '../styles/Tags.css';

class Tags extends Component {
  constructor(props){
    super(props);
    this.state = {
      idea: props.idea
    }
  }

  render() {
    return (
      <div className="tagsContainer">
        <ForSaleTag forSale={this.state.idea.forSale}/>
      </div>
    );
  }
}


function ForSaleTag(props) {
  const forSale = props.forSale;
  if (forSale) {
    return(
      <Tag tagClass="forSale" text="For sale" />
    );
  };
  return ""
}

function Tag(props) {
  const text = props.text;
  const tagClass = props.tagClass;
  return(
    <div className={`${tagClass}Tag tag`}>{text}</div>
  )
}

export default Tags;
