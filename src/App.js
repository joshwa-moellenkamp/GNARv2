
import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Collapsible from 'react-collapsible';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Link from '@material-ui/core/Link';
import { green, red } from '@material-ui/core/colors';
import { TextFilter } from 'react-text-filter';

const useStyles = makeStyles(theme => ({
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
    // fontSize: 16,
    // fontWeight: "bold", 
  },
  pointVal: {
    // fontSize: 16,
    // fontWeight: "bolder",
    // color: "#3483eb",
  },
  button: {
    margin: theme.spacing(1)
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
}));

const minLengthForChallengeFilter = 3

class Challenge {
  constructor(points, description, other) {
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
      console.log('Fetching JSON data source')
      await fetch('https://joshwa-moellenkamp.github.io/GNAR/source.json')
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        localStorage.setItem('challenges', JSON.stringify(json));
      })
      .catch((err) => {
        console.error('Failed to fetch JSON data source')
      })
    }

    var categories = []
    var challenges = new Map()
    let data = JSON.parse(localStorage.getItem('challenges'))
    Object.keys(data).forEach((category) => {
      var categoryKeys = []
      data[category].forEach((challenge) => {
        categoryKeys.push(challenge.name)
        var chall = new Challenge(challenge.points, challenge.description, challenge.other)
        challenges.set(challenge.name, chall)
      })
      categories.push({category, categoryKeys})
    })

    // This map intended to have key (from challenges), value (number of times challenge completed)
    var completed = new Map()
    this.setState({ challenges: challenges, categories: categories, completed: completed, filter: '' })
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
    const challengeFilter = filter => challenge => challenge.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    
    var challengesForFilter = []
    if(this.state.challenges != null) {
      this.state.challenges.forEach((challenge, name) => {
        challengesForFilter.push(name)
      })
    }

    const filteredChallenges = this.state.filter ?
      challengesForFilter.filter(challengeFilter(this.state.filter)) :
      challengesForFilter.slice(0)
  
    if(this.state.challenges == null) {
      return null
    }
    
    return (
      <HashRouter>
        <div style={{ padding: "5% 5%" }}>
          <Scoreboard challenges={this.state.challenges} completed={this.state.completed}/>
          <div style={{ padding: "2em .1em" }}>
            <Card style={{ minWidth: 275, padding: "15px", border: "1px solid #ccc" }}>
              <div>
                <TextFilter onFilter={({target: {value: filter}}) => this.setState({filter})} placeholder="Search for a Challenge (min. 3 characters)" minLength={minLengthForChallengeFilter}/>
                <List items={filteredChallenges} challenges={this.state.challenges} challengeCompleted={this.challengeCompleted.bind(this)} filter={this.state.filter}/>
              </div>
            </Card>
          </div>
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
          <AlertDialog
            title={"Background"}
            content={
              "GNAR (Gaffney's Numerical Assessment of Radness) is a response " +
              "to the ski industry taking itself altogether too seriously. "+
              "Earn points for riding particularly rad lines or achieving particularly " +
              "hilarious tasks. Lose points for doing anything uncharictaristically lame. " +
              "Losers pay for beer."
            }
          />
          <Button variant="outlined" color="primary">
            <Link href={"http://simplemethod.com/GNAR.pdf"} target="_blank" rel="noopener">
              Adapted GNAR Rulesheet for Vail
            </Link>
          </Button>
          <Button variant="outlined" color="primary">
            <Link href={"http://squallywood.com/"} target="_blank" rel="noopener">
              Squallywood
            </Link>
          </Button>
          <Button variant="outlined" color="primary">
            <Link href={"https://www.vail.com/the-mountain/about-the-mountain/trail-map.aspx"} target="_blank" rel="noopener">
              Vail Trailmaps
            </Link>
          </Button>
        </div>
      </HashRouter>
    )
  }
}

function AlertDialog({ title, content }) {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        {title}
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

function List({ items, challenges, challengeCompleted, filter }) {
  if(filter.length < minLengthForChallengeFilter) {
    return null
  }

  return (
    <Table style={{ tableLayout: "auto" }}>
      <TableHead>
        <TableRow>
          <TableCell></TableCell>
          <TableCell style={{ width: "20%" }}>Challenge</TableCell>
          <TableCell style={{ width: "10%" }}>Points</TableCell>
          <TableCell style={{ width: "60%" }}>Description</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item}>
            <TableCell>
              <GreenButton variant="contained" onClick={(e) => challengeCompleted(item)}>
                Complete
              </GreenButton>
            </TableCell>
            <TableCell>
              {item}
            </TableCell>
            <TableCell>
              {challenges.get(item).points}
            </TableCell>
            <TableCell>
              {challenges.get(item).description}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function CollapsibleChallengesCompleted({ challenges, completed, challengeDecrement }) {
  const classes = useStyles();
  if(Array.from(completed) === 'undefined' || Array.from(completed).length === 0) {
    return (
      <div style={{ padding: "2em .1em" }}>
        <Card style={{ minWidth: 275, padding: "15px", border: "1px solid #ccc" }}>
          <Collapsible transitionTime={300} trigger={"Completed Challenges"} style={{ fontWeight: "bolder" }}>
            <h5>You haven't completed any challenges yet! Get out there for heck's sake!</h5>
          </Collapsible>
        </Card>
      </div>
    )
  }

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
                    <RedButton variant="contained" className={classes.button} onClick={(e) => challengeDecrement(value[0])}>
                      {value[1] > 1 ? 'Decrement' : 'Remove'}
                    </RedButton>
                  </TableCell>
                  <TableCell>{value[1]}</TableCell>
                  <TableCell className={classes.challenge}>
                    {value[0]}
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

const GreenButton = withStyles(theme => ({
  root: {
    color: theme.palette.getContrastText(green[300]),
    backgroundColor: green[300],
    '&:hover': {
      backgroundColor: green[500],
    },
  },
}))(Button);

const RedButton = withStyles(theme => ({
  root: {
    color: theme.palette.getContrastText(red[300]),
    backgroundColor: red[300],
    '&:hover': {
      backgroundColor: red[500],
    },
  },
}))(Button);

function CollapsibleCategory({ categoryName, categoryChallengeIds, challenges, challengeCompleted }) {  
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
          {Array.from(categoryChallengeIds).map((challenge) => (
            <TableRow key={challenge}>
              <TableCell>
                <GreenButton variant="contained" onClick={(e) => challengeCompleted(challenge)}>
                  Complete
                </GreenButton>
              </TableCell> 
              <TableCell>{challenge}</TableCell>
              <TableCell>{challenges.get(challenge).points}</TableCell>
              <TableCell>{challenges.get(challenge).description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Collapsible>
  )
}

export default App;
