import './styles/App.css';
import Nav from './components/Nav.js';
import Home from './components/Home.js';
import ViewIdea from './components/ViewIdea.js';
import CreateIdea from './components/CreateIdea.js';
import Login from './components/Login.js';
import Register from './components/Register.js';
import MyIdeas from './components/MyIdeas.js';
import EditIdea from './components/EditIdea.js';
import Profile from './components/Profile.js';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import React, { Component } from "react";
import Cookie from 'js-cookie';
import { getToken } from './helper.js';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoggedIn: false,
    }
  }

  componentDidMount() {
    const access_token = getToken();
    if (access_token) {
      this.setState({ "isLoggedIn": true });
    }
  }

  globalLogin = (access_token, username) => {
    this.setState({ "isLoggedIn": true });
    Cookie.set("access_token", access_token, { SameSite: 'lax' });
    Cookie.set("username", username, { SameSite: 'lax' });
  }

  globalLogout = () => {
    this.setState({ "isLoggedIn": false });
    Cookie.remove("access_token");
    Cookie.remove("username");
    Cookie.remove("token");
  }

  render() {
    //Intermediates are necessary to pass history.push prop for rerouting
    const LoginIntermediate = (props) => {
      return (
        <Login {...props} globalLogin={this.globalLogin}/>
      )
    }
    const RegisterIntermediate = (props) => {
      return (
        <Register {...props} globalLogin={this.globalLogin}/>
      )
    }
    return (
      <Router>
        <div className="App">
          <Nav isLoggedIn={this.state.isLoggedIn} globalLogout={this.globalLogout}/>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/myIdeas" exact component={MyIdeas} />
            <Route path="/idea/:ideaId" exact component={ViewIdea} />
            <Route path="/login" exact component={LoginIntermediate} />
            <Route path="/register" exact component={RegisterIntermediate} />
            <Route path="/newIdea" exact component={CreateIdea} />
            <Route path="/editIdea/:ideaId" exact component={EditIdea} />
            <Route path="/:username" exact component={Profile} />
          </Switch>
        </div>
      </Router>
    );
  }
}


export default App;
