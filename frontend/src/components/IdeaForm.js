import React, { Component } from "react";
import '../styles/IdeaForm.css';
import axiosApiInstance from '../helper.js';
import Cookie from 'js-cookie';


class IdeaForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      ideaId: props.ideaId,
      title: "",
      description: "",
      private: false,
      formType: props.formType,
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.state.formType === "edit") {
      axiosApiInstance.get(`/api/get_idea/${this.state.ideaId}`
      ).then(response => {
        this.setState({ title: response.data.idea.title,
                        description: response.data.idea.description,
                        private: response.data.idea.private,
                      });
      });
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    if (this.state.formType === 'create') {
      this.handleSubmitCreate(event);
    } else {
      this.handleSubmitEdit(event);
    }
  }

  async handleSubmitCreate(event) {
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

  async handleSubmitEdit(event) {
    event.preventDefault();
    axiosApiInstance.patch(`/api/edit_idea/${this.state.ideaId}`,
      { title: this.state.title,
        description: this.state.description,
        private: this.state.private }
    ).then(response => {
      this.props.history.push(`/idea/${response.data._id}`);
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
      <div className="ideaFormBoxContainer">
      <div className="standardBorder ideaFormBox">
        <h1>Create an Idea</h1>
        <form onSubmit={this.handleSubmit}>
          <input
            name="title"
            type="text"
            className="ideaFormTitle"
            placeholder="Title"
            value={this.state.title}
            onChange={this.handleInputChange} />
          <br/>
          <p className="markdownWarning">Use <a href="https://www.markdownguide.org/cheat-sheet/" style={{"color": "#2d7de6"}}>markdown</a> to style your idea description</p>
          <textarea
            type="text"
            name="description"
            className="ideaFormDescription"
            placeholder="Describe your idea..."
            value={this.state.description}
            onChange={this.handleInputChange} />
          <br/>
          <label>
            Do you wish to keep this idea private?:
          <input
            type="checkbox"
            name="private"
            className="ideaFormPrivate ideaFormCheckbox"
            value={this.state.private}
            checked={this.state.private}
            onChange={this.handleInputChange} />
          </label>
          <br/>
          {
            //add up to 3 tags
          }
          <input type="submit" value="Submit"/>
        </form>
      </div>
      </div>
    );
  }
}

export default IdeaForm;
