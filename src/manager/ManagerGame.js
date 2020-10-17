import * as React from "react";
import 'react-dice-complete/dist/react-dice-complete.css'
import "../css/game.css"
import API from "../service/API";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import Container from "@material-ui/core/Container/Container";
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";
import PlayersTable from "./PlayerTable";
import {resetGameByGuid} from "../service/gameSevice";
import TableContainer from "@material-ui/core/TableContainer/TableContainer";
import {Paper} from "@material-ui/core";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import one from '../images/one.png';
import two from '../images/two.png';
import three from '../images/three.png';
import four from '../images/four.png';
import five from '../images/five.png';
import six from '../images/six.png';

export default class ManagerGame extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      gameGuid: this.props.match.params.guid,
      error: "",
      dices: {},
      players: [],
      reveal: false,
      distribution: []
    }
  }

  componentDidMount() {
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

  render() {
    if (this.state.gameGuid === undefined) {
      return <div>NOT A VALID GAME</div>
    }

    const images = [one, two, three, four, five, six];
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

              {this.state.players.length > 0 && <PlayersTable
                  players={this.state.players} dices={this.state.dices}/>}

              {this.state.reveal && <TableContainer component={Paper}>
                <Table style={{minWidth: "650"}} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      {images.map(image => {
                        return <TableCell>
                          <img alt={"Nothing"} src={image} style={{
                          height: "50px",
                          width: "50px"
                        }}/>
                        </TableCell>
                      })}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow>
                      {
                        [1, 2, 3, 4, 5, 6].map(dice => {
                          return <TableCell> {this.getDistribution(dice)}</TableCell>
                        })
                      }
                    </TableRow>
                  </TableBody>
                </Table>

              </TableContainer>}

            </Typography>
          </Container>
        </div>
    )
  }

  getDistribution = (idx) => {
    return this.state.distribution[idx]
        ? this.state.distribution[idx].length : 0
  };

  removeErrorMsg = () => {
    this.setState({
      error: ""
    })
  };

  getAllDices = () => {
    this.removeErrorMsg();

    const body = {
      state: "APPROVE_TO_REVEAL"
    };
    API.put(
        'games/'+this.state.gameGuid, body
    ).then((response) => {
      if (response.data){
        API.get(
            'dices?gameGuid=' + this.state.gameGuid,
        ).then((response)=>{
          if (response.data) {
            let dices = this.groupByAllPlayersResults(response.data, 'playerId', 'value');
            this.setState({
              dices: dices,
              distribution: this.groupBy(response.data, 'value'),
              reveal: true
            });
          }
        }).catch((err) => {
          this.setState({
            error: err.message
          })
        })
      }
    }).catch((err) => {
      this.setState({
        error: err.message
      })
    });
  };

  getAllPlayers = () => {
    this.removeErrorMsg();

    API.get(
        'players?gameGuid=' + this.state.gameGuid,
    ).then(async (response)=>{
      debugger;
      let players = await response.data;
      this.setState({
          players: players
        });
    }).catch((err) => {
      this.setState({
        error: err.message
      })
    })
  };

  rollAllDices = () => {
    this.removeErrorMsg();

    debugger;
    if (this.state.players){
      const body = {
        gameGuid: this.state.gameGuid,
      };
      API.post(
          'dices', body
      ).then((response) => {
        if (response.data){
          let obfuscated = {};
          for (const player of this.state.players) {
            for (let i=0; i<player.numberOfDices; i++) {
              if (!obfuscated[player.id]){
                obfuscated[player.id] = [];
              }
              obfuscated[player.id].push('*');
            }
          }
          this.setState({
            dices: obfuscated
          })
        }
      }).catch((err)=>{
        this.setState({
          error: err.message
        })
      });
    }
  };

  initGame = () => {
    this.removeErrorMsg();

    resetGameByGuid(this.state.gameGuid);
    this.setState({
      dices: {},
      reveal: false,
      distribution: []
    })
  };

  groupByAllPlayersResults(OurArray, mapBy, value) {
    return OurArray.reduce((accumulator, object) => {
      const key = object[mapBy];
      if (!accumulator[key]) {
        accumulator[key] = [];
      }
      accumulator[key].push(object[value]);
      return accumulator;
    }, []);
  }

  groupBy(OurArray, property) {
    return OurArray.reduce(function (accumulator, object) {
      const key = object[property];
      if (!accumulator[key]) {
        accumulator[key] = [];
      }
      accumulator[key].push(object);
      return accumulator;
    }, []);
  }

}