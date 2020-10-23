import * as React from "react";
import 'react-dice-complete/dist/react-dice-complete.css'
import "../css/game.css"
import TableContainer from "@material-ui/core/TableContainer/TableContainer";
import Table from "@material-ui/core/Table/Table";
import {Paper} from "@material-ui/core";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableHead from "@material-ui/core/TableHead/TableHead";
import {Link} from "react-router-dom";
import del from '../images/delete.png';
import {deleteGame} from "../service/gameSevice";

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

  render() {
    const {games} = this.state;
    return (
        <div>
          {games && games.length > 0 && <TableContainer component={Paper}>
            <Table style={{minWidth: "650"}} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell><strong>פעולות</strong></TableCell>
                  <TableCell><strong>מצב</strong></TableCell>
                  <TableCell><strong>תאריך</strong></TableCell>
                  <TableCell><strong>שם</strong></TableCell>
                  <TableCell><strong>מזהה</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  games && games.map(game => {
                    return <TableRow>
                      <TableCell>
                        <button><img alt={"מחק"} src={del} style={{width:"25px"}} onClick={() => this.deleteGame(game)}/></button>
                      </TableCell>
                      <TableCell>{game.state}</TableCell>
                      <TableCell>{new Date(game.createdDate).toLocaleDateString() + ", " + new Date(game.createdDate).toLocaleTimeString()}</TableCell>
                      <TableCell>{game.name}</TableCell>
                      <TableCell>
                        <Link to={"/game/"+game.guid}>{game.guid}</Link>
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