import * as React from "react";
import 'react-dice-complete/dist/react-dice-complete.css'
import "./css/game.css"
import Dices from "./Dices";
import API from "./API";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import Container from "@material-ui/core/Container/Container";
import Typography from "@material-ui/core/Typography/Typography";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";

export default class ManagerGame extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      gameGuid: undefined,
      playerName: this.getRandom(this.items),
      playerId: 0,
      numOfDices: 0,
      start: false,
    }
  }

  componentDidMount() {
    const {match: {params}} = this.props;
    this.setState({
      gameGuid: params.guid
    });
    this.createPlayer(params.guid);
  }

  getRandom = (items) => {
    return items[Math.floor(Math.random()*items.length)] +'_' + Math.floor((Date.now() / 1000) % 10000);
  };

  items = ['Euclid', 'Pythagoreans', 'Archimedes', 'Kepler', 'Descartes', 'Pascal', 'Newton', 'Leibniz', 'Euler', 'Gauss'];

  start = () => {
    this.setState({
      start: true,
    })
  };

  render() {
    if (this.state.gameGuid === undefined) {
      return <div>NOT A VALID GAME</div>
    }

    return (
        <div>

          <CssBaseline/>
          <Container maxWidth="sm">
            <Typography variant="h3" gutterBottom>
              Game Manager
            </Typography>
            <Typography component="div"
                        style={{backgroundColor: '#cfe8fc', height: '100vh'}}>
              {this.state.error && <div
                  style={{color: "red"}}>ERROR: {this.state.error}</div>}
              <br/>

              <Button variant={"contained"} onClick={this.createPlayer}>Reveal All Dices</Button>

              <Button variant={"contained"} onClick={this.createPlayer}>Roll All Dices</Button>

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


    // return (
    //     <div>
    //       <div>Game Manager</div>
    //
    //       Enter number of dices for this round:
    //       <select value={this.state.numOfDices} onChange={this.updateNumberOfDices}>
    //         <option value="1">1</option>
    //         <option value="2">2</option>
    //         <option value="3">3</option>
    //         <option value="4">4</option>
    //         <option value="5">5</option>
    //       </select>
    //       <br/>
    //       <button onClick={this.start} disabled={!this.state.start}>Start round</button>
    //       <div>
    //         {this.state.start && this.state.numOfDices > 0 && <Dices
    //             numberOfDices={this.state.numOfDices}
    //             gameGuid={this.state.gameGuid}
    //             playerId={this.state.playerId}/>}
    //       </div>
    //     </div>
    // )
  }

  createPlayer = (guid) => {
    const player = {
      gameGuid: guid,
      name: this.state.playerName,
      numberOfDices: this.state.numOfDices
    };
    API.post(
        'players', player
    )
    .then((response) => {
      if (response.data) {
        this.setState({
          playerId: response.data.id
        })
      }
      else {
        throw Error("Some Error!!!!")
      }
    }).catch((err) => {
      alert(err.message)
    })
  };

  updateNumberOfDices = (value) => {
    this.setState({
      numOfDices: value.target.value,
      start: false
    });

    const player = {
      numberOfDices: this.state.numOfDices
    };
    API.put(
        'players/'+this.state.playerId, player
    )
    .catch((err) => {
      alert(err.message)
    })
  }
}