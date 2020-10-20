import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {HashRouter, Route} from "react-router-dom";
import GamesCreator from "./creator/GamesCreator";
import ManagerGame from "./manager/ManagerGame";
import Player from "./player/Player";
import CreateGameForm from "./manager/CreateGameForm";

ReactDOM.render(
    <React.StrictMode>
      <HashRouter>
        <Route exact path={"/"} component={CreateGameForm}/>
        <Route exact path={"/admin"} component={GamesCreator}/>
        <Route exact path={"/game/:guid"} component={ManagerGame}/>
        <Route exact path={"/game/:guid/player"} component={Player}/>
      </HashRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
