import * as React from "react";
import 'react-dice-complete/dist/react-dice-complete.css'
import "../css/game.css"
import Container from "@material-ui/core/Container/Container";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import Typography from "@material-ui/core/Typography/Typography";
import ButtonGroup from "@material-ui/core/ButtonGroup/ButtonGroup";
import Button from "@material-ui/core/Button/Button";
import GamesTable from "./GamesTable";
import {createGame, getAllGames} from "../service/gameSevice";
import ManagerGame from "../manager/ManagerGame";

export default class GamesCreator extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      games: [],
      error: undefined
    };
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

              <Typography variant="h3" gutterBottom>
                Active Games
              </Typography>

              <ButtonGroup color="primary"
                           aria-label="outlined primary button group">
                <Button onClick={() => this.createGame()}>Add Game</Button>
                <Button onClick={() => this.getAllGames()}>Get All Games</Button>
              </ButtonGroup>

              {this.state.games.length > 0 && <GamesTable
                  games={this.state.games}/>}

            </Typography>
          </Container>
        </div>
    )
  }
}