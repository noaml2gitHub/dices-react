import * as React from "react";
import 'react-dice-complete/dist/react-dice-complete.css'
import "../css/game.css"
import API from "../service/API";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import Container from "@material-ui/core/Container/Container";
import Typography from "@material-ui/core/Typography/Typography";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import YourMother from "./YourMother";

export default class ManagerGame extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      gameGuid: this.props.match.params.guid,
      error: "",
      dices: [],
      players: []
      // playerName: this.getRandom(this.items),
      // numOfDices: 0,
      // start: false,
    }
  }

  componentDidMount() {
    debugger;
    const {match: {params}} = this.props;
    this.setState({
      gameGuid: params.guid
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.location !== prevProps.location) {
      this.setState({
        gameGuid: this.props.match.params.guid
      })
    }
  }

    // getRandom = (items) => {
  //   return items[Math.floor(Math.random()*items.length)] +'_' + Math.floor((Date.now() / 1000) % 10000);
  // };

  // items = ['Euclid', 'Pythagoreans', 'Archimedes', 'Kepler', 'Descartes', 'Pascal', 'Newton', 'Leibniz', 'Euler', 'Gauss'];

  // start = () => {
  //   this.setState({
  //     start: true,
  //   })
  // };

  render() {
    debugger;
    let a = this.props.match.params.guid;
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

              <Button variant={"contained"} onClick={this.getAllDices}>Reveal All Dices</Button>
              <Button variant={"contained"} onClick={this.getAllPlayers}>Update players list</Button>
              <Button variant={"contained"} onClick={this.rollAllDices}>Roll All Dices</Button>
              <Button variant={"contained"} onClick={this.initGame}>New Round</Button>

              {this.state.players.length > 0 && <YourMother
                  players={this.state.players} dices={this.state.dices}/>}
              </Typography>
          </Container>
        </div>
    )
  }

  getAllDices = () => {
    API.get(
        'dices?gameGuid=' + this.state.gameGuid,
    ).then((response)=>{
      if (response.data) {
        this.setState({
          dices: this.groupBy(response.data, 'playerId', 'value')
        });
      }
    }).catch((err) => {
      this.setState({
        error: err.message
      })
    })
  };

  getAllPlayers = () => {
    API.get(
        'players?gameGuid=' + this.state.gameGuid,
    ).then((response)=>{
        this.setState({
          players: response.data
        });
    }).catch((err) => {
      this.setState({
        error: err.message
      })
    })
  };

  rollAllDices = () => {
    debugger;
    if (this.state.players){
      for (const player of this.state.players) {
        const body = {
              gameGuid: this.state.gameGuid,
              playerId: player.id
            };
        API.post(
            'dices', body
        ).then((response) => {
          if (response.data) {
            let arr = response.data;
            let values = [];
            arr.map((dice) => {
              values.push(dice.value);
              return values;
            });
            let copyOfDices = this.state.dices;
            copyOfDices.push(player.id, values);
            this.setState({
              dices: copyOfDices
            })
          }
          else {
            throw Error("Some Error!!!!")
          }
        })
      }
    }
  };

  initGame = () => {
    API.delete(
        'dices/' + this.state.gameGuid
    ).then((response) => {
      this.setState({
        dices: []
      })
    })
    /*NOAM - Update game state to ACTIVE
    * And make table to be updated BLAT */
  };

  groupBy(OurArray, mapBy, value) {
    return OurArray.reduce(function (accumulator, object) {
      const key = object[mapBy];
      if (!accumulator[key]) {
        accumulator[key] = [];
      }
      accumulator[key].push(object[value]);
      return accumulator;
    }, []);
  }
}