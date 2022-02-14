import React, { Component } from "react";
import '../styles/Donate.css';

class Donate extends Component {
  render() {
    return (
      <div className="donateMain">
        <h1>Donate</h1>
        <p>
          To make a recurring donation, go to <a href="https://liberapay.com/Ideaspot/">https://liberapay.com/Ideaspot/</a>.
          If you only want to donate once, you can donate to the project on venmo @lukew3.
          Just mention ideaspot and I'll make sure the funds go to the right place.
        </p>
      </div>
    );
  }
}

export default Donate;
