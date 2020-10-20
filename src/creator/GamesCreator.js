import * as React from "react";
import 'react-dice-complete/dist/react-dice-complete.css'
import "../css/game.css"
import Container from "@material-ui/core/Container/Container";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";
import GamesTable from "./GamesTable";
import {createGame, getAllGames} from "../service/gameSevice";

export default class GamesCreator extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      games: [],
      error: undefined
    };
    this.getAllGames();
  }

  createGame = async () => {
    this.setState({
      error: undefined
    });
    try {
      let arr = this.state.games;
      arr.push(await createGame());
      this.setState({
        games: arr
      })
    }
    catch (e) {
      this.setState({
        error: e.message
      })
    }

  };

  getAllGames = async () => {
    this.setState({
      error: undefined
    });
    try {
      this.setState({
        games: await getAllGames()
      })
    }
    catch (e) {
      this.setState({
        error: e.message
      })
    }
  };

  render() {
    return (
        <div>
          {this.state.error && <div
              style={{color: "red"}}>ERROR: {this.state.error}</div>}
          <CssBaseline/>
          <Container maxWidth="sm">
            <Typography component="div"
                        style={{backgroundColor: '#cfe8fc', height: '100vh'}}>

              <Typography variant="h3" gutterBottom style={{textAlign: "center"}}>
                משחקים פעילים
              </Typography>

              <div className={"button_margin"} style={{textAlign: "center"}}>
                <Button variant="contained" color="default" onClick={() => this.createGame()}>הוסף משחק</Button>
                <Button variant="contained" color="default" onClick={() => this.getAllGames()}>עדכן את רשימת המשחקים</Button>
              </div>

              {this.state.games.length > 0 && <GamesTable
                  games={this.state.games}/>}

            </Typography>
          </Container>
        </div>
    )
  }
}