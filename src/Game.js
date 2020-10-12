import * as React from "react";
import 'react-dice-complete/dist/react-dice-complete.css'
import "./css/game.css"
import Dices from "./Dices";

export default class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      numberOfDices: 0,
      start: false
    }
  }

  handleChange = (value) => {
    this.setState({
      numberOfDices: value.target.value,
      start: false
    })
  }

  start = () => {
    this.setState({
      start: true
    })
  }

  render() {
    return (
        <div>
          <div>
            {this.state.start && this.state.numberOfDices > 0 && <Dices
                numberOfDices={this.state.numberOfDices}/>}
          </div>
          הכנס מספר קוביות: <button
            onClick={this.start}>התחל</button>
          <input type="text" onChange={this.handleChange}/>
        </div>

    )
  }

}