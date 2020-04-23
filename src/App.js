import React, {useState, useEffect} from 'react';
import Main from './pages/Main';
import Room from './pages/Room';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import './App.css';

function App() {


  return (
    <div className="App">
      <HelmetProvider>
        <Router>
          <Route exact path="/" component={Main} />
          <Route path="/room" component={Room} />
        </Router>
      </HelmetProvider>
    </div>
  );
}

export default App;
