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
          <div>Hello {this.state.playerName}</div>

          Enter number of dices for this round:
          <select value={this.state.numOfDices} onChange={this.updateNumberOfDices}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <br/>
          <button onClick={this.start} disabled={!this.state.start}>Start round</button>
          <div>
            {this.state.start && this.state.numOfDices > 0 && <Dices
                numberOfDices={this.state.numOfDices}
                gameGuid={this.state.gameGuid}
                playerId={this.state.playerId}/>}
          </div>
        </div>
    )
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