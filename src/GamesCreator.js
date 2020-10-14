import * as React from "react";
import 'react-dice-complete/dist/react-dice-complete.css'
import API from "./API";
import "./css/game.css"
import Game from "./Game";

export default class GamesCreator extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      games: []
    };
    this.getAllGames();
  }

  createGame = () => {
    return API.post(
        'games',
    )
    .then((response) => {
          if (response.data) {
            let arr = this.state.games;
            arr.push(response.data)
            this.setState({
              games: arr
            })
          }
          else {
            throw Error("Some Error!!!!")
          }
        }
    )
    .catch((e) => {
      throw e;
    })
  }

  getAllGames = () => {
    return API.get(
        'games',
    )
    .then((response) => {
          if (response.data) {
            let arr = response.data;
            this.setState({
              games: arr
            })
          }
          else {
            throw Error("Some Error!!!!")
          }
        }
    )
    .catch((e) => {
      throw e;
    })
  }

  deleteGame = (game) => {
    return API.delete(
        'games/'+ game.guid,
    ).then((response) => {
      let arr = this.state.games;
      let index = arr.indexOf(game);
      if (index !== -1){
        arr.splice(index, 1);
        this.setState({
          games: arr
        })
      }
    })
  }

  revealGame = (game) => {
    return this.changeGameState(game, "APPROVE_TO_REVEAL");
  };

  resetGame = (game) => {
    return API.delete(
        'dices/' + game.guid,
    ).then((response) => {
      if (response.status == 200){
        return this.changeGameState(game, "ACTIVE");
      }
    })
  };

  changeGameState = (game, state) => {
    const updateTo = {
      state: state
    };
    return API.put(
        'games/'+ game.guid, updateTo
    ).then((response) => {
      if (response.data){
        let arr = this.state.games;
        let index = arr.indexOf(game);
        if (index !== -1){
          arr.splice(index, 1, response.data);
          this.setState({
            games: arr
          })
        }
      }
    })
  };

  render() {
    const {games} = this.state;
    return (
        <div className={"game-creator"}>
          <p><b>Active Games</b></p>
          <button onClick={() => this.createGame()}>Add Game</button>
          <button onClick={() => this.getAllGames()}>Get All Games</button>
          <table>
            <thead>
            <tr>
              <td>Guid</td>
              <td>State</td>
              <td>Action</td>
            </tr>
            </thead>
            <tbody>
            {
              games.map(game => {
                return <tr>
                      <td>{game.guid}</td>
                      <td>{game.state}</td>
                      <td>
                        <button onClick={()=>this.deleteGame(game)}>Delete</button>
                      </td>
                      <td>
                        <button onClick={()=>this.revealGame(game)}>Reveal</button>
                      </td>
                      <td>
                        <button onClick={()=>this.resetGame(game)}>Init</button>
                      </td>
                    </tr>
              })
            }
            </tbody>
          </table>
        <Game/>
        </div>
    )
  }
}