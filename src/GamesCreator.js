import * as React from "react";
import 'react-dice-complete/dist/react-dice-complete.css'
import API from "./API";
import "./css/game.css"

export default class GamesCreator extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      games: []

    }
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

  render() {
    const {games} = this.state;
    return (
        <div className={"game-creator"}>
          <p><b>Active Games</b></p>
          <button onClick={() => this.createGame()}>Add Game</button>
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
                        <button>Delete</button>
                      </td>
                    </tr>
              })
            }
            </tbody>
          </table>
        </div>
    )
  }

}