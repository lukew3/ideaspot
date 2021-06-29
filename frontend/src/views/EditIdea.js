import React, { Component } from "react";
import axiosApiInstance from '../helper.js';
import { IdeaForm } from '../components/index.js';

class EditIdea extends Component {
  render() {
    return (
      <IdeaForm
        formType="edit"
        history={this.props.history}
        ideaId={this.props.match.params.ideaId} />
    );
  }
}

export default EditIdea;
