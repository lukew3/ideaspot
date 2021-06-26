import './styles/App.css';
import { About, Nav, Home, ViewIdea, CreateIdea, Login, SignUp, MyIdeas, EditIdea,
  Profile, RequestPassReset, PasswordReset, Trash } from './components/index.js';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import React, { Component } from "react";
import Cookie from 'js-cookie';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoggedIn: false,
      username: "",
    }
  }

  componentDidMount() {
    const refresh_token = Cookie.get("refresh_token") ? Cookie.get("refresh_token") : null;
    if (refresh_token) {
      this.setState({ "isLoggedIn": true,
                      "username": Cookie.get("username") });
    }
  }

  globalLogin = (access_token, refresh_token, username) => {
    this.setState({ "isLoggedIn": true, "username": username });
    Cookie.set("access_token", access_token, { SameSite: 'lax', expires: 1 });
    Cookie.set("refresh_token", refresh_token, { SameSite: 'lax', expires: 182 });
    Cookie.set("username", username, { SameSite: 'lax', expires: 365 });
  }

  globalLogout = () => {
    this.setState({ "isLoggedIn": false });
    Cookie.remove("access_token");
    Cookie.remove("username");
    Cookie.remove("refresh_token");
  }

  render() {
    //Intermediates are necessary to pass history.push prop for rerouting
    const LoginIntermediate = (props) => {
      return (
        <Login {...props} globalLogin={this.globalLogin}/>
      )
    }
    const SignUpIntermediate = (props) => {
      return (
        <SignUp {...props} globalLogin={this.globalLogin}/>
      )
    }
    const PasswordResetIntermediate = (props) => {
      return (
        <PasswordReset {...props} globalLogin={this.globalLogin}/>
      )
    }
    return (
      <Router>
        <div className="App">
          <Nav isLoggedIn={this.state.isLoggedIn} globalLogout={this.globalLogout} username={this.state.username}/>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/myIdeas" exact component={MyIdeas} />
            <Route path="/idea/:ideaId" exact component={ViewIdea} />
            <Route path="/login" exact component={LoginIntermediate} />
            <Route path="/register" exact component={SignUpIntermediate} />
            <Route path="/newIdea" exact component={CreateIdea} />
            <Route path="/trash" exact component={Trash} />
            <Route path="/about" exact component={About} />
            <Route path="/editIdea/:ideaId" exact component={EditIdea} />
            <Route path="/requestPasswordReset" exact component={RequestPassReset} />
            <Route path="/passwordReset/:jwt" exact component={PasswordResetIntermediate} />
            <Route path="/:username" exact component={Profile} />
          </Switch>
        </div>
      </Router>
    );
  }
}


export default App;
