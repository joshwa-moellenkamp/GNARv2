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
      return (
        <div className="App">
          <header className="App-header">
            <h1>H1</h1>
            <table>
              <tbody>
                { this.renderElements() }
              </tbody>
            </table>
          </header>
        </div>
      )
    } else {
      return null
    }
  }

  renderElements() {
    var categories = Object.keys(this.state.challenges)
    console.log(categories)
    console.log(this.state.challenges[categories[0]])
    return this.state.challenges[categories[0]].map((challenge, index) => {
      const { name, points, description } = challenge
      console.log('name', name)
      return (
        <tr key={index}>
          <td>{name}</td>
          <td>{points}</td>
          <td>{description}</td>
          <td></td>
        </tr>
      )
    })
  }
}

export default App;
