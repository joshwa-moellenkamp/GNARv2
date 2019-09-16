import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Collapsible from 'react-collapsible';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  padding: "3em 3em",
  card: {
    minWidth: 275,
    padding: "15px",
    border: "1px solid #ccc",
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  pos: {
    marginBottom: 12,
  },
  challenge: {
    fontSize: 16,
    fontWeight: "bold", 
  },
  pointVal: {
    fontSize: 16,
    fontWeight: "bolder",
    color: "#3483eb",
  },
  description: {
    fontSize: 12,
    fontWeight: 400
  },
  category: {
    fontSize: 20,
    fontWeight: "bolder",
    padding: "0em 1em"
  },
  tableDiv: {
    padding: "5em 5em",
    color: "red"
  }
});

class Challenge {
  constructor(category, name, points, description, other) {
    this.category = category;
    this.name = name;
    this.points = points;
    this.description = description;
    this.other = other;
  }
}

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
    // Process the JSON into `Challenge` objects before setting state
    this.setState({ challenges: JSON.parse(localStorage.getItem('challenges')) })

    // var challenges = []

    // var json = localStorage.getItem('challenges');
    // json.map((value) => {
    //   challenges.push(new Gnarly(category, value.name, value.points, value.description, value.other));
    // });
    

  }

  render () {
    if(this.state.challenges != null && this.state.challenges !== 'undefined') {
      var challenges = this.state.challenges
      var challengeCategories = Object.keys(challenges)
      return (
        challengeCategories.map((category, index) => {
          return (
            <ChallengeCategoryTable 
              category={ challengeCategories[index] }
              challenges={ challenges[challengeCategories[index]] }
            />
          )
        })
      )
    } else {
      return null
    }
  }
}

function ChallengeCategoryTable({ category, challenges }) {
  const classes = useStyles();
  return (
    <Collapsible 
      transitionTime={300}
      trigger={ category.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ') }>
      <Table style={{ tableLayout: "auto" }}>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell style={{ width: "20%" }}>Challenge</TableCell>
            <TableCell style={{ width: "10%" }}>Points</TableCell>
            <TableCell style={{ width: "70%" }}>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {challenges.map((challenge, index) => (
            <TableRow key={index}>
              <TableCell>
                <Button variant="contained" color="#3483eb" className={ classes.button }>
                  COMPLETE
                </Button>
              </TableCell> 
              <TableCell className={ classes.challenge }>{challenge.name}</TableCell>
              <TableCell className={ classes.pointVal }>{challenge.points}</TableCell>
              <TableCell className={ classes.description }>{challenge.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Collapsible>
  )
}

export default App;
