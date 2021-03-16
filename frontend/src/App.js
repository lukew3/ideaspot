import './styles/App.css';
import Nav from './components/Nav.js';
import Home from './components/Home.js';
import ViewIdea from './components/ViewIdea.js';
import CreateIdea from './components/CreateIdea.js';
import Login from './components/Login.js';
import Register from './components/Register.js';
import MyIdeas from './components/MyIdeas.js'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/myIdeas" exact component={MyIdeas} />
          <Route path="/idea/:ideaId" component={ViewIdea} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/newIdea" component={CreateIdea} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
