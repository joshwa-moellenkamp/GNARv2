import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import 'typeface-roboto';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { }
  }

  async componentDidMount() {
    if(localStorage.getItem('challenges') === null) {
      await fetch('https://joshwa-moellenkamp.github.io/GNAR/source.json')
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        localStorage.setItem('challenges', JSON.stringify(json));
      })
    }
    this.setState({ challenges: JSON.parse(localStorage.getItem('challenges')) })
  }

  render () {



    if(this.state.challenges != null && this.state.challenges !== 'undefined') {
      var challenges = this.state.challenges
      var challengeCategories = Object.keys(challenges)
      return (
        <div className="App">
          <header className="App-header">
            {
              challengeCategories.map((category, index) => {
                return (
                  <div>
                    { this.renderElements(challengeCategories[index], challenges[challengeCategories[index]]) }
                  </div>
                )
              })
            }
          </header>
        </div>
      )
    } else {
      return null
    }
  }

  renderElements(category, challenges) {
    return (
      <Card>
        <Typography variant="h5" component="h2">
          category
        </Typography>
        <Table style={{ tableLayout: "auto" }}>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: "30%" }}>Challenge</TableCell>
              <TableCell style={{ width: "10%" }}>Point Value</TableCell>
              <TableCell style={{ width: "60%" }}>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {challenges.map((challenge, index) => (
              <TableRow key={index}>
                <TableCell>{challenge.name}</TableCell>
                <TableCell>{challenge.points}</TableCell>
                <TableCell>{challenge.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    )
  }
}

export default App;
