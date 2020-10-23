import * as React from "react";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import Container from "@material-ui/core/Container/Container";
import Typography from "@material-ui/core/Typography/Typography";
import ButtonGroup from "@material-ui/core/ButtonGroup/ButtonGroup";
import Button from "@material-ui/core/Button/Button";
import API from "../service/API";
import ReactDice from "react-dice-complete";
import 'react-dice-complete/dist/react-dice-complete.css'
import logo from "../images/logo.png";
import smallLogo from "../images/small-logo.png";
import TextField from "@material-ui/core/TextField/TextField";

export default class Player extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      gameGuid: "",
      error: undefined,
      player: null,
      dices: [],
      playerName: null
    };
  }

  componentDidMount() {
    const {match: {params}} = this.props;
    this.setState({
      gameGuid: params.guid
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.location !== prevProps.location) {
      this.setState({
        gameGuid: this.props.match.params.guid
      })
    }
  }

  // getRandomName = () => {
  //   return this.items[Math.floor(Math.random()*this.items.length)] +'_' + Math.floor((Date.now() / 1000) % 100000);
  // };
  //
  // items = ['Euclid', 'Pythagoreans', 'Archimedes', 'Kepler', 'Descartes', 'Pascal', 'Newton', 'Leibniz', 'Euler', 'Gauss'];

  createPlayer = () =>{
    let body = {
      "gameGuid": this.state.gameGuid,
      "name": this.state.playerName,
      "numberOfDices": 5
    };

    API.post(
      'players', body
    ).then((response) => {
      if (response.data){
        this.setState({
          player: response.data
        })
      }
    })
  };

  render() {
    if (this.state.gameGuid === undefined) {
      return <div>NOT A VALID GAME</div>
    }

    return (
        <div class="row" style={{textAlign: "center"}}>
          <div className="right" style={{textAlign: "right"}}>
            <a href={"https://yuni.co.il/"}> <img src={logo} alt="Logo"
                                                  width={"92%"}/></a>
          </div>

          {this.state.error && <div
            style={{color: "red"}}>ERROR: {this.state.error}</div>}
        <CssBaseline/>
        <Container maxWidth="md">
          <Typography component="div"
                      style={{backgroundColor: '#cfe8fc', height: '100vh'}}>

            <div className={"button_margin"} style={{textAlign: "center"}}>
              <form style={{textAlign: "center"}} noValidate autoComplete="off">
                <TextField id="standard-basic" label="שם השחקן/ית" required={true} size={'medium'} onChange={(event) => this.setState({playerName: event.target.value})} disabled={this.state.player != null}/>
              </form>
            </div>

            <div className={"button_margin"} style={{textAlign: "center"}}>
              <Button variant="contained" color="default" disabled={this.state.playerName == null || this.state.player != null} onClick={() => this.createPlayer()}>!הצטרף למשחק</Button>
            </div>

            {this.state.player != null && <Typography variant="h3" gutterBottom
                                                      style={{marginTop: "10px"}}>
                   שלום  {this.state.player && this.state.player.name}
            </Typography>
            }

            <ButtonGroup color="primary"
                         aria-label="outlined primary button group" style={{marginTop: "40px"}}>
              <Button onClick={() => this.rollAll()} disabled={this.state.player == null}>חשוף את הקוביות שלי לסבב זה</Button>
            </ButtonGroup>

            <div style={{marginTop: "25px"}}>
              { this.state.rolled && <ReactDice
                  numDice={this.state.player.numberOfDices}
                  defaultRoll={1}
                  outline={true}
                  disableIndividual={true}
                  ref={dice => this.reactDice = dice}
                  faceColor={"#f0f0ff"}
                  dotColor={"#000000"}
                  dieSize={50}
                  margin={30} /> }
            </div>
          </Typography>
        </Container>
          <div className="footer">
            <p> <img src={smallLogo} height={"20px"} width={"20px"} alt={""}/>    האתר נכתב על ידי נעם לידני עבור </p>
          </div>
        </div>
    )
  }

  rollAll() {
    API.get(
        'players/' + this.state.player.id
    ).then((response) => {
      if (response.data){
        this.setState({
          player: response.data
        });
        API.get(
            'dices?gameGuid=' + this.state.gameGuid + '&playerId=' + this.state.player.id
        ).then((response) => {
          if (response.data) {
            let arr = response.data;
            if (arr.length === 0){
              alert("הקוביות עדיין לא הוטלו על ידי מנהל/ת המשחק");
            } else {
              this.setState({
                rolled: true
              });
              let values = [];
              arr.map((dice) => {
                values.push(dice.value);
                return values;
              });
              this.reactDice.rollAll(values);
            }
          }
          else {
            throw Error("Some Error!!!!")
          }
        }).catch(function(response) {
          alert(response.message);
        });
      }
    }).catch(function(response) {
      alert(response.message);
    });

  }
}