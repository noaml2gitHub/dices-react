import * as React from "react";
import 'react-dice-complete/dist/react-dice-complete.css'
import "../css/game.css"
import Container from "@material-ui/core/Container/Container";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";
import GamesTable from "./GamesTable";
import {createGame, getAllGames} from "../service/gameSevice";
import logo from '../images/logo.png';
import smallLogo from "../images/small-logo.png";

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
      arr.push(await createGame("מנהל_"+Math.floor((Date.now() / 1000) % 100000)));
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
        <div class="row">
          <div className="right" style={{textAlign: "right"}}>
            <a href={"https://yuni.co.il/"}> <img src={logo} alt="Logo"
                                                  width={"92%"}/></a>
          </div>
          {this.state.error && <div
              style={{color: "red"}}>ERROR: {this.state.error}</div>}
          <CssBaseline/>
          <Container maxWidth="md">
            <Typography component="div"
                        style={{backgroundColor: '#cfe8fc', marginBottom: "100px"}}>

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
          <div className="footer">
            <p> <img src={smallLogo} height={"20px"} width={"20px"} alt={""}/>    האתר נכתב על ידי נעם לידני עבור </p>
          </div>
        </div>
    )
  }
}