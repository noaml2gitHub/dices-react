import * as React from "react";
import ReactDice from 'react-dice-complete'
import 'react-dice-complete/dist/react-dice-complete.css'

export default class Home extends React.Component{

  constructor(props){
    super(props);
    this.state={
      player:"noam"
    }
  }

   rename(){
    this.setState({
      player:"dddd"
    })
   }

  render() {
    const {player}=this.state;
    return (
        <div>
          <p>Player is: {player}</p>
          <ReactDice
              numDice={5}
              rollDone={this.rollDoneCallback}
              ref={dice => this.reactDice = dice}
          />
          <button onClick={()=>this.rename()}>Click</button>
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