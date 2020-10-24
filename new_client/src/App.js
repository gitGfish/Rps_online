import React from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom'
import Game from "../src/views/Game"
import Lobby from "../src/views/Lobby"
import MainMenu from '../src/views/MainMenu'
function App() {
  return (
    <Router>
      <Route path={`${process.env.PUBLIC_URL}/`} exact component={MainMenu}/>
      <Route path={`${process.env.PUBLIC_URL}/Lobby`} exact component={Lobby}/>
      <Route path={`${process.env.PUBLIC_URL}/Game`} exact component={Game}/>
    </Router>
  );
}

export default App;
