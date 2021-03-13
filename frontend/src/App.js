import './styles/App.css';
import Nav from './components/Nav.js';
import Home from './components/Home.js';
import ViewIdea from './components/ViewIdea.js';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/idea/:ideaId" component={ViewIdea} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
