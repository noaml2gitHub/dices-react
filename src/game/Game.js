import * as React from "react";
import 'react-dice-complete/dist/react-dice-complete.css'
import "../css/game.css"
import Dices from "./Dices";
import API from "../service/API";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import Container from "@material-ui/core/Container/Container";
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";
import TextField from "@material-ui/core/TextField/TextField";

export default class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      gameGuid: undefined,
      playerName: "",
      numOfDices: 0,
      start: false,
      error: undefined
    }
  }

  componentDidMount() {
    const {match: {params}} = this.props;
    this.setState({
      gameGuid: params.guid
    })
  }

  handlePlayerChange = (value) => {
    this.setState({
      playerName: value.target.value,
      start: false
    })
  }

  handleGameGuidChange = (value) => {
    this.setState({
      gameGuid: value.target.value,
      start: false
    })
  }

  handleChange = (value) => {
    this.setState({
      numOfDices: value.target.value,
      start: false
    })
  }

  start = (playerId) => {
    this.setState({
      start: true,
      playerId: playerId
    })
  }

  render() {

    if (this.state.gameGuid === undefined) {
      return <div>NOT A VALID GAME</div>
    }

    return (
        <div>

          <CssBaseline/>
          <Container maxWidth="sm">
            <Typography variant="h3" gutterBottom>
              Your Game
            </Typography>
            <Typography component="div"
                        style={{backgroundColor: '#cfe8fc', height: '100vh'}}>
              {this.state.error && <div
                  style={{color: "red"}}>ERROR: {this.state.error}</div>}
              <br/>
              <TextField
                  onChange={this.handlePlayerChange}
                  label="Enter Your name"
                  id="outlined-size-small"
                  variant="outlined"
                  size="small"
              />

              <TextField
                  onChange={this.handleChange}
                  label="Enter number of dices"
                  id="outlined-size-small"
                  variant="outlined"
                  size="small"
              />

              <Button variant={"contained"} onClick={this.createPlayer}>Create
                Dices</Button>
              <div>
                {this.state.start && this.state.numOfDices > 0 && <Dices
                    numberOfDices={this.state.numOfDices}
                    gameGuid={this.state.gameGuid}
                    playerId={this.state.playerId}/>}
              </div>
            </Typography>
          </Container>
        </div>
    )
  }

  createPlayer = () => {
    this.setState({
      error: undefined
    })
    const player = {
      gameGuid: this.state.gameGuid,
      name: this.state.playerName,
      numberOfDices: this.state.numOfDices
    };
    API.post(
        'players', player
    )
    .then((response) => {
      if (response.data) {
        this.start(response.data.id)
      }
      else {
        throw Error("Some Error!!!!")
      }
    }).catch((err) => {
      this.setState({
        error: err.message
      })
    })
  }
}