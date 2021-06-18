import React from "react";
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Animals } from './components/Animals';
import { Animal } from './components/Animal';
import { PageNotFound } from './components/PageNotFound';

function App() {
  return (
      <Router>
        <Switch>
          <Route exact path="/">
            
              <Animals></Animals>
          </Route>
          <Route path="/animal/:id">
          <div className="wrapper">
              <Animal></Animal>
          </div>
          </Route>
          <Route path="*">
            <PageNotFound></PageNotFound>
          </Route>
        </Switch>
      </Router>
  );
}

export default App;
