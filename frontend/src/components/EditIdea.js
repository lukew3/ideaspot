import React, { Component } from "react";
import '../styles/CreateIdea.css';
import { axiosApiInstance } from '../helper.js';


class EditIdea extends Component {
  constructor(props){
    super(props);
    this.state = {
      ideaId: props.match.params.ideaId,
      title: "",
      details: "",
      private: false,
      forSale: false,
      price: 0
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    axiosApiInstance.get(`/api/get_idea/${this.state.ideaId}`
    ).then(response => {
      this.setState({ title: response.data.idea.title,
                      details: response.data.idea.details,
                      private: response.data.idea.private,
                      forSale: response.data.idea.forSale,
                    });
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    axiosApiInstance.patch(`/api/edit_idea/${this.state.ideaId}`,
      { title: this.state.title,
        details: this.state.details,
        forSale: this.state.forSale,
        private: this.state.private }
    ).then(response => {
      this.props.history.push(`/idea/${response.data._id}`);
    }).catch(error => {
      console.log(error);
      console.log("Error");
    });
  }

  render() {
    return (
      <div className="ideaBox createIdeaBox">
        <h1>Edit Idea</h1>
        <form onSubmit={this.handleSubmit}>
          <input
            name="title"
            type="text"
            className="createIdeaTitle"
            placeholder="Title"
            value={this.state.title}
            onChange={this.handleInputChange} />
          <br/>
          <p className="markdownWarning">Use <a href="https://www.markdownguide.org/cheat-sheet/">markdown</a> to style your idea description</p>
          <textarea
            type="text"
            name="details"
            className="createIdeaDetails"
            placeholder="Describe your idea..."
            value={this.state.details}
            onChange={this.handleInputChange} />
          <br/>
          <label>
            Is this idea for sale?:
          <input
            type="checkbox"
            name="forSale"
            className="createIdeaForSale createIdeaCheckbox"
            value={this.state.forSale}
            checked={this.state.forSale}
            onChange={this.handleInputChange} />
          </label>
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
    );
  }
}

export default EditIdea;
