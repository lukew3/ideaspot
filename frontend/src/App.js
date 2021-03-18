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



class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoggedIn: false,
    }
  }
  componentDidMount() {
    const token = Cookie.get("token") ? Cookie.get("token") : null;
    if (token) {
      this.setState({ "isLoggedIn": true });
    }
  }
  globalLogin = () => {
    this.setState({ "isLoggedIn": true });
  }
  globalLogout = () => {
    this.setState({ "isLoggedIn": false });
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Nav isLoggedIn={this.state.isLoggedIn} globalLogout={this.globalLogout}/>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/myIdeas" exact component={MyIdeas} />
            <Route path="/idea/:ideaId" exact component={ViewIdea} />
            <Route path="/login" exact>
              <Login globalLogin={this.globalLogin} />
            </Route>
            <Route path="/register" exact>
              <Register globalLogin={this.globalLogin} />
            </Route>
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
