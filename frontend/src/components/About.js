import React, { Component } from "react";
import '../styles/About.css';

class About extends Component {
  render() {
    return (
      <div className="aboutMain">
        <h1>About</h1>
        <p>
          Ideaspot is a community of people who want to share their ideas, and work
          together to create new things. Ideaspot was officially launched on June 25, 2021.
          Ideaspot's source code is free and open-source, available on Github <a href="https://github.com/lukew3/ideaspot">here</a>.
          Of course, contributions are welcome. If you spot a bug, you can open an issue on Github or you can email me, the lead developer,
          at lukew25073@gmail.com.
        </p>
      </div>
    );
  }
}

export default About;
