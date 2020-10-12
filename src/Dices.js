import * as React from "react";
import ReactDice from 'react-dice-complete'
import 'react-dice-complete/dist/react-dice-complete.css'

export default class Dices extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      numberOfDices: props.numberOfDices

    }
  }

  render() {
    return (
        <div>
          <ReactDice
              numDice={this.state.numberOfDices}
              rollDone={this.rollDoneCallback}
              ref={dice => this.reactDice = dice}
          />
          <button onClick={() => this.rollAll()}>גלגל את הקוביות</button>
        </div>
    )
  }

  rollAll() {
    this.reactDice.rollAll()
  }

  rollDoneCallback(num) {
    alert(`You rolled a ${num}`)
  }

}