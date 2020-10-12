import * as React from "react";
import ReactDice from 'react-dice-complete'
import 'react-dice-complete/dist/react-dice-complete.css'

export default class Dices extends React.Component {

  render() {
    return (
        <div>
          <ReactDice
              numDice={5}
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
    console.log(`You rolled a ${num}`)
  }

}