import React, { Component } from "react";
import '../styles/CreateIdea.css';
import axiosApiInstance from '../helper.js';
import Cookie from 'js-cookie';


class CreateIdea extends Component {
  constructor(props){
    super(props);
    this.state = {
      title: "",
      description: "",
      private: false,
      forSale: false,
      price: 0
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    axiosApiInstance.post(`/api/create_idea`,
      { title: this.state.title,
        description: this.state.description,
        private: this.state.private }
    ).then(response => {
      this.props.history.push(`/idea/${response.data.id}`);
    }).catch(error => {
      console.log(error);
      console.log("Error");
    });
  }

  render() {
    const username = Cookie.get("username") ? Cookie.get("username") : null;
    if (username === null) {
      this.props.history.push(`/login`);
    }
    return (
      <div className="createIdeaBoxContainer">
      <div className="standardBorder createIdeaBox">
        <h1>Create an Idea</h1>
        <form onSubmit={this.handleSubmit}>
          <input
            name="title"
            type="text"
            className="createIdeaTitle"
            placeholder="Title"
            value={this.state.title}
            onChange={this.handleInputChange} />
          <br/>
          <p className="markdownWarning">Use <a href="https://www.markdownguide.org/cheat-sheet/" style={{"color": "#2d7de6"}}>markdown</a> to style your idea description</p>
          <textarea
            type="text"
            name="description"
            className="createIdeaDescription"
            placeholder="Describe your idea..."
            value={this.state.description}
            onChange={this.handleInputChange} />
          <br/>
          <label>
            Do you wish to keep this idea private?:
          <input
            type="checkbox"
            name="private"
            className="createIdeaPrivate createIdeaCheckbox"
            value={this.state.private}
            checked={this.state.private}
            onChange={this.handleInputChange} />
          </label>
          <br/>
          {
            //set your price
            //add up to 3 tags
            //checkbox for show prime first(checked by default)
          }
          <input type="submit" value="Submit"/>
        </form>
      </div>
      </div>
    );
  }
}

export default CreateIdea;
