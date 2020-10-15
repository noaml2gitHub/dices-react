import * as React from "react";
import ReactDice from 'react-dice-complete'
import 'react-dice-complete/dist/react-dice-complete.css'
import API from "../service/API";
import Button from "@material-ui/core/Button/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup/ButtonGroup";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import Table from "@material-ui/core/Table/Table";

import one from '../images/one.png';
import two from '../images/two.png';
import three from '../images/three.png';
import four from '../images/four.png';
import five from '../images/five.png';
import six from '../images/six.png';
import TableBody from "@material-ui/core/TableBody/TableBody";
import TableContainer from "@material-ui/core/TableContainer/TableContainer";
import {Paper} from "@material-ui/core";

export default class Dices extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      numberOfDices: props.numberOfDices,
      rolled: false,
      gameGuid: props.gameGuid,
      playerId: props.playerId,
      distribution: []
    }
  }

  getDistribution = (idx) => {
    return this.state.distribution[idx]
        ? this.state.distribution[idx].length : 0
  }

  render() {

    const images = [one, two, three, four, five, six];
    debugger
    return (
        <div>
          <ReactDice
              numDice={this.state.numberOfDices}
              defaultRoll={1}
              outline={true}
              disableIndividual={true}
              ref={dice => this.reactDice = dice}
          />
          <ButtonGroup color="secondary"
                       aria-label="outlined secondary button group">
            <Button onClick={() => this.rollAll()}>Roll
              the dices</Button>
            <Button onClick={() => this.revealAll()}>Reveal
              All Dices Distribution</Button>
          </ButtonGroup>
          <TableContainer component={Paper}>
            <Table style={{minWidth: "650"}} aria-label="simple table">
              <TableHead>
                <TableRow>
                  {images.map(image => {
                    return <TableCell><img src={image} style={{
                      height: "50px",
                      width: "50px"
                    }}/></TableCell>
                  })}
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  {
                    [1, 2, 3, 4, 5, 6].map(dice => {
                      return <TableCell> {this.getDistribution(
                          dice)}</TableCell>
                    })
                  }
                </TableRow>
              </TableBody>
            </Table>

          </TableContainer>
        </div>
    )
  }

  revealAll() {
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
    }).catch(function (response) {
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
        this.reactDice.rollAll(values)
      }
      else {
        throw Error("Some Error!!!!")
      }
    }).catch(function (response) {
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