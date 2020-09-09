import React from 'react';
import { Router, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';

import Main from './pages/Main';
import Room from './pages/Room';
import history from "./utilities/history";
import './styles/App.scss';

export default function App() {
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
