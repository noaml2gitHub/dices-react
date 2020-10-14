import * as React from "react";
import 'react-dice-complete/dist/react-dice-complete.css'
import "./css/game.css"
import Dices from "./Dices";
import API from "./API";

export default class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      gameGuid: undefined,
      playerName: "",
      numOfDices: 0,
      start: false
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

    if (this.state.guid === undefined) {
      return <div>NOT A VALID GAME</div>
    }

    return (
        <div>
          Enter Game Guid:
          <input id="gameGuid" type="text"
                 onChange={this.handleGameGuidChange}/>
          <td/>
          Enter Your name:
          <input id="playerName" type="text"
                 onChange={this.handlePlayerChange}/>
          <td/>
          Enter number of dices:
          <input type="text" onChange={this.handleChange}/>
          <td/>
          <button onClick={this.createPlayer}>Create Dices</button>
          <div>
            {this.state.start && this.state.numOfDices > 0 && <Dices
                numberOfDices={this.state.numOfDices}
                gameGuid={this.state.gameGuid} playerId={this.state.playerId}/>}
          </div>
        </div>
    )
  }

  createPlayer = () => {
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
    }).catch(function (response) {
      alert(response.message);
    })
  }
}