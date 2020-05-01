import React from 'react';
import Main from './pages/Main';
import Room from './pages/Room';
import { Router, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import history from "./utilities/history";
import './styles/App.scss';

function App() {
  return (
    <div className="App">
      <HelmetProvider>
        <Router history={history}>
          <Route exact path="/"  render={props => <Main {...props} />} />
          <Route path="/room:id" render={props => <Room {...props} />} />
        </Router>
      </HelmetProvider>
    </div>
  );
}

export default App;
