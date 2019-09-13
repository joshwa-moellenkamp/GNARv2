import React from 'react';
import './App.css';

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
                    <h3>{category}</h3>
                    { this.renderElements(challenges[challengeCategories[index]]) }
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

  renderElements(challenges) {
    return challenges.map((challenge, index) => {
      const { name, points, description } = challenge
      return (
        <table>
          <tbody>
            <tr key={index}>
              <td>{name}</td>
              <td>{points}</td>
              <td>{description}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      )
    })
  }
}

export default App;
