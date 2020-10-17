import * as React from "react";
import 'react-dice-complete/dist/react-dice-complete.css'
import "../css/game.css"
import TableContainer from "@material-ui/core/TableContainer/TableContainer";
import Table from "@material-ui/core/Table/Table";
import {Paper} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableHead from "@material-ui/core/TableHead/TableHead";
import API from "../service/API";
import one from '../images/one.png';
import two from '../images/two.png';
import three from '../images/three.png';
import four from '../images/four.png';
import five from '../images/five.png';
import six from '../images/six.png';
import qmark from '../images/question.png';
import del from '../images/delete.png';

export default class PlayersTable extends React.Component {

  constructor(props) {
    debugger;
    super(props);
    this.state = {
      players: props.players,
      dices: props.dices || {}
    };
  }

  componentWillReceiveProps(prevProps, prevState) {
    if (prevProps.players !== this.state.players){
      this.setState({
        players: prevProps.players
      })
    }
    if (prevProps.dices !== this.state.dices){
      this.setState({
        dices: prevProps.dices
      })
    }
  }

  render() {
    const {players} = this.state;
    return (
        <div>
          {players && players.length > 0 && <TableContainer component={Paper}>
            <Table style={{minWidth: "650"}} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Player Name</TableCell>
                  <TableCell>Number Of Dices</TableCell>
                  <TableCell>Player's Dices</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  players && players.map(player => {
                    return <TableRow>
                      <TableCell>{player.name}</TableCell>
                      <TableCell>
                        <select value={player.numberOfDices} onChange={(event) => this.updateNumberOfDices(player, event.target.value)}>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </TableCell>
                      <TableCell>{this.paintDices(player.id)}</TableCell>
                      <TableCell><button><img alt={""} src={del} style={{width:"25px"}} onClick={() => this.deletePlayer(player)}/></button></TableCell>
                    </TableRow>
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
          }
        </div>
    )
  }

  deletePlayer = (player) => {
    let confirm = window.confirm("Are you sure you want to delete " + player.name + "?");
    if (confirm){
      API.delete(
          'players/' + player.id
      ).then((response) => {
        let copy = this.state.players;
        let index = this.getIndex(copy, 'id', player.id);
        if (index !== -1){
          copy.splice(index, 1);
          this.setState({
            players: copy
          })
        }
      })
    }
  };

  paintDices = (playerId) => {
    debugger;
    if (this.state.dices && Object.keys(this.state.dices).length > 0 && this.state.dices[playerId]){
      debugger;
      let images = [];
      for (let i=0; i<this.state.dices[playerId].length; i++){
         switch (this.state.dices[playerId][i]) {
           case 1:
            images.push(<img alt="" src={one} style={{width:"25px"}}/>);
            break;
           case 2:
             images.push(<img alt="" src={two} style={{width:"25px"}}/>);
             break;
           case 3:
             images.push(<img alt="" src={three} style={{width:"25px"}}/>);
             break;
           case 4:
             images.push(<img alt="" src={four} style={{width:"25px"}}/>);
             break;
           case 5:
             images.push(<img alt="" src={five} style={{width:"25px"}}/>);
             break;
           case 6:
             images.push(<img alt="" src={six} style={{width:"25px"}}/>);
             break;
           default:
             images.push(<img alt="" src={qmark} style={{width:"25px"}}/>);
             break;
         }
      }
      return (<div>{images}</div>)
    }
  };

  updateNumberOfDices = (player, num) => {
    const body = {
      numberOfDices: num,
    };
    API.put(
        'players/' + player.id, body
    ).then((response) => {
      if (response.data){
        let copy = this.state.players;
        let index = this.getIndex(copy, 'id', player.id);
        copy[index] = response.data;
        this.setState({
          players: copy
        })
      }
    })
  };

  getIndex = (arr, prop, value) => {
    for(let i = 0; i < arr.length; i++) {
      if(arr[i][prop] === value) {
        return i;
      }
    }
    return -1;
  }
}
