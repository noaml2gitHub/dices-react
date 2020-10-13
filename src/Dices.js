import * as React from "react";
import ReactDice from 'react-dice-complete'
import 'react-dice-complete/dist/react-dice-complete.css'
import API from "./API";


export default class Dices extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      numberOfDices: props.numberOfDices,
      rolled: false,
      gameGuid: props.gameGuid,
      playerId: props.playerId,
      values: []
    }
  }

  render() {
    return (
        <div>
          <ReactDice
              numDice={this.state.numberOfDices}
              defaultRoll={1}
              outline={true}
              disableIndividual={true}
              rollDone={this.rollDoneCallback}
              ref={dice => this.reactDice = dice}
          />
          <button onClick={() => this.rollAll()} disabled={this.state.rolled}>Roll the dices</button>
        </div>
    )
  }

  rollAll() {
    const dice = {
      gameGuid: this.state.gameGuid,
      playerId: this.state.playerId
    };
    debugger
    API.post(
        'dices', dice
    ).then((response) => {
      debugger
      if (response.data) {
        let arr = response.data;
        let values = [];
        arr.map((dice) => {
          values.push(dice.value);
          return values;
        });
        this.setState({
          values: values
        });
        this.reactDice.rollAll(this.state.values)
      }
      else {
        throw Error("Some Error!!!!")
      }
    })
    .catch((e) => {
      throw e;
    })
    this.setState({
      rolled: true
    })
  }

  rollDoneCallback(num) {
    alert(`You rolled a ${num}`)
  }

}