import React from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom'
import Game from "../src/views/Game"
import Lobby from "../src/views/Lobby"
import MainMenu from '../src/views/MainMenu'
function App() {
  return (
    <Router>
      <Route path="/" exact component={MainMenu}/>
      <Route path="/Lobby" exact component={Lobby}/>
      <Route path="/Game" exact component={Game}/>
    </Router>
  );
}

export default App;
