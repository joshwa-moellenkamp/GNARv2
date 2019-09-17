import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Collapsible from 'react-collapsible';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card'

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
    // color: "#3483eb",
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
  constructor(name, points, description, other) {
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
    var challenges = []
    let data = JSON.parse(localStorage.getItem('challenges'))
    Object.keys(data).forEach((category) => {
      var categoryChallenges = data[category]
      challenges.push([{category, categoryChallenges}])
    })

      // challenges.forEach((categoryMap) => {
  //   categoryMap.forEach((category) => {
  //     category.categoryChallenges.map((challenge, index) => {
  //       console.log(challenge, category.category)
  //     })
  //   })
  // })

    this.setState({ challenges: challenges })
  }

  render () {
    if(this.state.challenges != null) {
      return (
        <div style={{ padding: "5% 5%" }}>
          <Scoreboard/>
          <CollapsibleCategoryCollection challenges={this.state.challenges}/>
        </div>
      )
    } else {
      return null
    }
  }
}

function Scoreboard() {
  return (
    <h2>Score</h2>
  )
} 

/**
 * This component renders a Collapsible challenge table inside of a card for each challenge category.
 * The `challenges` argument should be the raw `this.state.challenges` object constructed in the
 * `componentDidMount()` lifecycle method for the App class. 
 */
function CollapsibleCategoryCollection( { challenges }) {
  const classes = useStyles();
  return (
    challenges.map((categoryMap) => (
      categoryMap.map((category) => (
        <div style={{padding: ".1em .1em"}}>
          <Card className={classes.card}>
            <CollapsibleCategory category={category}/>
          </Card>
        </div>
      ))
    ))
  )
}

function CollapsibleCategory({ category }) {
  const classes = useStyles();
  return (
    <Collapsible 
      transitionTime={300}
      trigger={ category.category.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ') }
      style={{ fontWeight: "bolder" }}>
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
          {category.categoryChallenges.map((value) => (
            <TableRow>
              <TableCell>
                <Button variant="contained" color="primary" className={ classes.button }>
                  COMPLETE
                </Button>
              </TableCell> 
              <TableCell className={classes.challenge}>{value.name}</TableCell>
              <TableCell className={classes.pointVal}>{value.points}</TableCell>
              <TableCell className={classes.description}>{value.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Collapsible>
  )
}

export default App;
