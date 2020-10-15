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
      distribution: []
    };
    this.rollAll();
  }

  render() {
    return (
        <div>
          <ReactDice
              numDice={this.state.numberOfDices}
              defaultRoll={1}
              outline={true}
              disableIndividual={true}
              ref={dice => this.reactDice = dice}
          />
          <button onClick={() => this.rollAll()}>Roll the dices</button>
          <button onClick={() => this.revealAll()} hidden={!this.state.rolled}>Reveal All Dices Distribution</button>
          <table>
            <thead>
            <tr>
              <td><img src={require('./images/one.png')} alt="" height="50" width="50"/></td>
              <td><img src={require('./images/two.png')} alt="" height="50" width="50"/></td>
              <td><img src={require('./images/three.png')} alt="" height="50" width="50"/></td>
              <td><img src={require('./images/four.png')} alt="" height="50" width="50"/></td>
              <td><img src={require('./images/five.png')} alt="" height="50" width="50"/></td>
              <td><img src={require('./images/six.png')} alt="" height="50" width="50"/></td>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td> {this.state.distribution[1] ? this.state.distribution[1].length : 0}</td>
              <td> {this.state.distribution[2] ? this.state.distribution[2].length : 0}</td>
              <td> {this.state.distribution[3] ? this.state.distribution[3].length : 0}</td>
              <td> {this.state.distribution[4] ? this.state.distribution[4].length : 0}</td>
              <td> {this.state.distribution[5] ? this.state.distribution[5].length : 0}</td>
              <td> {this.state.distribution[6] ? this.state.distribution[6].length : 0}</td>
            </tr>
            </tbody>
          </table>
        </div>
    )
  }

  revealAll(){
    API.get(
        'dices?gameGuid=' + this.state.gameGuid
    ).then((response) => {
      if (response.data) {
        let arr = response.data;
        let distribution = this.groupBy(arr, 'value');
        this.setState({
          distribution: distribution
        });
      }
    }).catch(function(response) {
      alert(response.message);
    })

  }

  rollAll() {
    const dice = {
      gameGuid: this.state.gameGuid,
      playerId: this.state.playerId
    };
    API.post(
        'dices', dice
    ).then((response) => {
      if (response.data) {
        let arr = response.data;
        let values = [];
        arr.map((dice) => {
          values.push(dice.value);
          return values;
        });
        this.reactDice.rollAll(values);
      }
      else {
        throw Error("Some Error!!!!")
      }
    }).catch(function(response) {
      alert(response.message);
    });
    this.setState({
      rolled: true
    })
  }

  groupBy(OurArray, property) {
    return OurArray.reduce(function (accumulator, object) {
      const key = object[property];
      if (!accumulator[key]) {
        accumulator[key] = [];
      }
      accumulator[key].push(object);
      return accumulator;
    }, []);
  }

}