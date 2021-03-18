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

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/myIdeas" exact component={MyIdeas} />
          <Route path="/idea/:ideaId" exact component={ViewIdea} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
          <Route path="/newIdea" exact component={CreateIdea} />
          <Route path="/editIdea/:ideaId" exact component={EditIdea} />
          <Route path="/:username" exact component={Profile} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
