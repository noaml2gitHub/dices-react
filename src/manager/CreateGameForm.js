import * as React from "react";
import 'react-dice-complete/dist/react-dice-complete.css'
import "../css/game.css"
import "../css/page.css"
import Container from "@material-ui/core/Container/Container";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";
import {createGame} from "../service/gameSevice";
import TextField from "@material-ui/core/TextField/TextField";
import logo from '../images/logo.png';
import smallLogo from "../images/small-logo.png";

export default class CreateGameForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      gameName: null,
      game: undefined,
      error: undefined
    };
  }

  createGame = async () => {
    debugger;
    this.setState({
      error: undefined
    });
    try {
      let game = await createGame(this.state.gameName);
      this.setState({
        game: game
      })
    }
    catch (e) {
      this.setState({
        error: e.message
      })
    }
    this.props.history.push("/game/" + this.state.game.guid);
  };

  render() {
    return (
        <div class="row">
          <div className="right" style={{textAlign: "right"}}>
            <a href={"https://yuni.co.il/"}> <img src={logo} alt="Logo"
                                                  width={"92%"}/></a>
          </div>
          {this.state.error && <div
              style={{color: "red"}}>ERROR: {this.state.error}</div>}
          <CssBaseline/>
          <Container maxWidth="md">
            <Typography component="div"
                        style={{backgroundColor: '#cfe8fc', marginBottom: "100px"}}>

              <Typography variant="h3" gutterBottom style={{textAlign: "center"}}>
                צור משחק חדש
              </Typography>

              <div className={"button_margin"} style={{textAlign: "center"}}>
                <form style={{textAlign: "center"}} noValidate autoComplete="off">
                  <TextField id="standard-basic" label="שם המשחק" required={true} size={'medium'} onChange={(event) => this.setState({gameName: event.target.value})}/>
                </form>
              </div>

              <div className={"button_margin"} style={{textAlign: "center"}}>
                  <Button variant="contained" color="default" disabled={this.state.gameName == null} onClick={() => this.createGame()}>צור משחק ועבור לשחק</Button>
              </div>

            </Typography>
          </Container>
          <div className="footer">
            <p> <img src={smallLogo} height={"20px"} width={"20px"} alt={""}/>    האתר נכתב על ידי נעם לידני עבור </p>
          </div>
        </div>
    )
  }
}