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

    var categories = []
    var challenges = new Map()
    let data = JSON.parse(localStorage.getItem('challenges'))
    var i = 0
    Object.keys(data).forEach((category) => {
      var categoryKeys = []
      data[category].forEach((challenge) => {
        categoryKeys.push(i)
        var chall = new Challenge(challenge.name, challenge.points, challenge.description, challenge.other)
        challenges.set(i, chall)
        i++
      })
      categories.push({category, categoryKeys})
    })

    // This map intended to have key (from challenges), value (number of times challenge completed)
    var completed = new Map()

    this.setState({ challenges: challenges, categories: categories, completed: completed })
  }

  challengeCompleted(key) {
    var completed = this.state.completed
    if(!this.state.completed.has(key)) {
      completed.set(key, 1)
    } else {
      let numTimesEarned = completed.get(key)
      completed.set(key, ++numTimesEarned)
    }
    this.setState(completed)
  }

  challengeDecrement(key) {
    var completed = this.state.completed
    if(!this.state.completed.has(key)) {
      console.warn('Could not decrement challenge!')
    } else if(this.state.completed.get(key) > 1) {
      // if the value is greater than 1, decrement
      let numTimesEarned = completed.get(key)
      completed.set(key, --numTimesEarned)
    } else {
      // if the value is 1, remove the challenge
      completed.delete(key)
    }
    this.setState(completed)
  }

  render () {
    if(this.state.challenges != null) {
      return (
        <div style={{ padding: "5% 5%" }}>
          <Scoreboard
            challenges={this.state.challenges}
            completed={this.state.completed}
          />
          <CollapsibleCategoryCollection
            challenges={this.state.challenges}
            categories={this.state.categories}
            challengeCompleted={this.challengeCompleted.bind(this)}
          />
          <CollapsibleChallengesCompleted
            challenges={this.state.challenges}
            completed={this.state.completed}
            challengeDecrement={this.challengeDecrement.bind(this)}
          />
        </div>
      )
    } else {
      return null
    }
  }
}

function CollapsibleChallengesCompleted({ challenges, completed, challengeDecrement }) {
  const classes = useStyles();
  return (
    <div style={{ padding: "2em .1em" }}>
      <Card className={classes.card}>
        <Collapsible
          transitionTime={300}
          trigger={"Completed Challenges"}
          style={{ fontWeight: "bolder" }}
        >
          <Table style={{ tableLayout: "auto" }}>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell style={{ width: "10%" }}>Times Earned</TableCell>
                <TableCell style={{ width: "20%" }}>Challenge</TableCell>
                <TableCell style={{ width: "10%" }}>Points</TableCell>
                <TableCell style={{ width: "60%" }}>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from(completed).map((value) => (
                <TableRow>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      className={classes.button}
                      onClick={(e) => challengeDecrement(value[0])}
                    >
                      {value[1] > 1 ? 'DECREMENT' : 'REMOVE'}
                    </Button>
                  </TableCell>
                  <TableCell>{value[1]}</TableCell>
                  <TableCell className={classes.challenge}>
                    {challenges.get(value[0]).name}
                  </TableCell>
                  <TableCell className={classes.pointVal}>
                    {challenges.get(value[0]).points}
                  </TableCell>
                  <TableCell className={classes.description}>
                    {challenges.get(value[0]).description}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Collapsible>
      </Card>
    </div>
  );
} 

function Scoreboard({ challenges, completed }) {
  var score = 0
  completed.forEach((timesCompleted, challengeId) => (
    score += challenges.get(challengeId).points * timesCompleted
  ))

  return (
    <h2>GNAR Value: {score}</h2>
  )
} 

function CollapsibleCategoryCollection({ challenges, categories, challengeCompleted }) {
  const classes = useStyles();
  var i = 0
  return (
    categories.map((category) => (
      <div style={{padding: ".1em .1em"}}>
        <Card className={classes.card} key={i++}>
          <CollapsibleCategory
            categoryName={category.category}
            categoryChallengeIds={category.categoryKeys}
            challenges={challenges}
            challengeCompleted={challengeCompleted.bind(this)}
          />
        </Card>
      </div>
    ))
  )
}

function CollapsibleCategory({ categoryName, categoryChallengeIds, challenges, challengeCompleted }) {
  const classes = useStyles();
  return (
    <Collapsible 
      transitionTime={300}
      trigger={ categoryName.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ') }
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
          {categoryChallengeIds.map((key) => (
            <TableRow key={key}>
              <TableCell>
                <Button
                  variant="contained"
                  className={classes.button}
                  onClick={(e) => challengeCompleted(key)}
                >
                  COMPLETE
                </Button>
              </TableCell> 
              <TableCell className={classes.challenge}>{challenges.get(key).name}</TableCell>
              <TableCell className={classes.pointVal}>{challenges.get(key).points}</TableCell>
              <TableCell className={classes.description}>{challenges.get(key).description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Collapsible>
  )
}

export default App;
