import * as React from "react";
import 'react-dice-complete/dist/react-dice-complete.css'
import "../css/game.css"
import ButtonGroup from "@material-ui/core/ButtonGroup/ButtonGroup";
import Button from "@material-ui/core/Button/Button";
import TableContainer from "@material-ui/core/TableContainer/TableContainer";
import Table from "@material-ui/core/Table/Table";
import {Paper} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableHead from "@material-ui/core/TableHead/TableHead";
import {changeGameState, deleteGame, resetGame} from "../service/gameSevice";
import {Link} from "react-router-dom";

export default class GamesTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      games: props.games
    };

  }

  deleteGame = async (game) => {
    this.setState({
      games: await deleteGame(game, this.state.games)
    });
  };

  revealGame = (game) => {
    return this.changeGameState(game, "APPROVE_TO_REVEAL");
  };

  resetGame = async (game) => {
    this.setState({
      games: await resetGame(game, this.state.games)
    })
  };

  changeGameState = async (game, state) => {
    this.setState({
      games: await changeGameState(game, state, this.state.games)
    })
  };

  render() {
    const {games} = this.state;
    return (
        <div>
          {games && games.length > 0 && <TableContainer component={Paper}>
            <Table style={{minWidth: "650"}} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Guid</TableCell>
                  <TableCell>State</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  games && games.map(game => {
                    return <TableRow>
                      <TableCell><Link to={"/game/"+game.guid}>{game.guid}</Link></TableCell>
                      <TableCell>{game.state}</TableCell>
                      <TableCell>
                        <ButtonGroup color="primary"
                                     aria-label="outlined primary button group">
                          <Button onClick={() => this.deleteGame(
                              game)}>Delete</Button>
                          <Button onClick={() => this.revealGame(
                              game)}>Reveal</Button>
                          <Button onClick={() => this.resetGame(
                              game)}>Init</Button>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  })
                }
              </TableBody>
            </Table>

          </TableContainer>
          }
        </div>
    )
  }
}