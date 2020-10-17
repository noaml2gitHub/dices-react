import * as React from "react";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import Container from "@material-ui/core/Container/Container";
import Typography from "@material-ui/core/Typography/Typography";
import ButtonGroup from "@material-ui/core/ButtonGroup/ButtonGroup";
import Button from "@material-ui/core/Button/Button";
import API from "../service/API";
import ReactDice from "react-dice-complete";
import 'react-dice-complete/dist/react-dice-complete.css'

export default class Player extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      gameGuid: "",
      error: undefined,
      player: undefined,
      dices: []
    };
  }

  componentDidMount() {
    const {match: {params}} = this.props;
    this.setState({
      gameGuid: params.guid
    });
    if (this.state.player === undefined){
      this.createPlayer(params.guid);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.location !== prevProps.location) {
      this.setState({
        gameGuid: this.props.match.params.guid
      })
    }
  }

  getRandomName = () => {
    return this.items[Math.floor(Math.random()*this.items.length)] +'_' + Math.floor((Date.now() / 1000) % 100000);
  };

  items = ['Euclid', 'Pythagoreans', 'Archimedes', 'Kepler', 'Descartes', 'Pascal', 'Newton', 'Leibniz', 'Euler', 'Gauss'];

  createPlayer = (gameGuid) =>{
    debugger;
    let name = this.getRandomName();
    let body = {
      "gameGuid": gameGuid,
      "name": name,
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
        <div>
        {this.state.error && <div
            style={{color: "red"}}>ERROR: {this.state.error}</div>}
        <CssBaseline/>
        <Container maxWidth="sm">
          <Typography component="div"
                      style={{backgroundColor: '#cfe8fc', height: '100vh'}}>
            <Typography variant="h3" gutterBottom>
              Hello {this.state.player && this.state.player.name}
            </Typography>
            <ButtonGroup color="primary"
                         aria-label="outlined primary button group">
              <Button onClick={() => this.rollAll()}>Reveal My Dices</Button>
            </ButtonGroup>

            { this.state.rolled && <ReactDice
                numDice={this.state.player.numberOfDices}
                defaultRoll={1}
                outline={true}
                disableIndividual={true}
                ref={dice => this.reactDice = dice}
                faceColor={"#f0f0ff"}
                dotColor={"#000000"}
                dieSize={50}
                margin={5} /> }
          </Typography>
        </Container>
      </div>
    )
  }

  rollAll() {
    API.get(
        'dices?gameGuid=' + this.state.gameGuid + '&playerId=' + this.state.player.id
    ).then((response) => {
      if (response.data) {
        let arr = response.data;
        if (arr.length === 0){
          alert("You can't reveal your dices yet");
        } else {
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
    this.setState({
      rolled: true
    })
  }
}