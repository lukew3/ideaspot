import React, { Component } from "react";
import axiosApiInstance from '../helper.js';
import { IdeaForm } from './index.js';
import Cookie from 'js-cookie';

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
