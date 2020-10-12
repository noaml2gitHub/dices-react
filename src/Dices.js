import * as React from "react";
import ReactDice from 'react-dice-complete'
import 'react-dice-complete/dist/react-dice-complete.css'
import API from "./API";

export default class Dices extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      player: "noam"
    }
  }

  callApi = () => {
    return API.get(
        'games',
    )
    .then((response) => {
          if (response.data) {
            debugger
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

  rename() {
    this.setState({
      player: "dddd"
    })
  }

  render() {
    const {player} = this.state;
    return (
        <div>
          <p>Player is: {player}</p>
          <ReactDice
              numDice={5}
              rollDone={this.rollDoneCallback}
              ref={dice => this.reactDice = dice}
          />
          <button onClick={() => this.callApi()}>Click</button>
        </div>
    )
  }

  rollAll() {
    this.reactDice.rollAll()
  }

  rollDoneCallback(num) {
    console.log(`You rolled a ${num}`)
  }

}