import * as React from "react";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import Container from "@material-ui/core/Container/Container";
import Typography from "@material-ui/core/Typography/Typography";
import ButtonGroup from "@material-ui/core/ButtonGroup/ButtonGroup";
import Button from "@material-ui/core/Button/Button";
import API from "../service/API";

export default class Player extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      gameGuid: "",
      error: undefined,
      playerName: this.getRandomName()
    }
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

  getRandomName = () => {
    return this.items[Math.floor(Math.random()*this.items.length)] +'_' + Math.floor((Date.now() / 1000) % 10000);
  };

  items = ['Euclid', 'Pythagoreans', 'Archimedes', 'Kepler', 'Descartes', 'Pascal', 'Newton', 'Leibniz', 'Euler', 'Gauss'];

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
              Hello {this.state.playerName}
            </Typography>
            <ButtonGroup color="primary"
                         aria-label="outlined primary button group">
              <Button onClick={() => this.revealMyDices()}>Reveal My Dices</Button>
            </ButtonGroup>
          </Typography>
        </Container>
      </div>
    )
  }

  revealMyDices = () => {
    API.get(
        '/dices'
    )
  }

}