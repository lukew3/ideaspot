import React, { Component } from "react";
import { IdeaForm } from '../components/index.js';

class CreateIdea extends Component {
  render() {
    return (
      <IdeaForm
        formType="create"
        history={this.props.history} />
    )
  }
}

export default CreateIdea;
