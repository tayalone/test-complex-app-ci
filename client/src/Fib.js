import React, { Component } from 'react'
import axios from 'axios'
export default class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: ''
  }
  componentDidMount() {
    this.fetchValues()
    this.fetchIndexes()
  }
  async fetchValues() {
    const res = await axios.get('/api/values/current')
    console.log(`fetchValues`, res.data)

    this.setState({ values: res.data })
  }
  async fetchIndexes() {
    const res = await axios.get('/api/values/all')
    console.log(`fetchIndexes`, res.data)
    this.setState({ seenIndexes: res.data })
  }

  handleSubmit = async (e) => {
    try {
      e.preventDefault()
      await axios.post('/api/values', { index: this.state.index })
      this.setState({ index: '' })
    } catch (err) {
      console.error(`error Fib.handleSubmit`, err)
    }
  }

  rendeerSeenIndexes = () => {
    return this.state.seenIndexes.map(({ number }) => number).join(', ')
  }
  renderValues = () => {
    const entries = []
    for (let key in this.state.values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {this.state.values[key]}
        </div>
      )
    }
    return entries
  }
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index:</label>
          <input
            value={this.state.index}
            onChange={(e) => this.setState({ index: e.target.value })}
          />
          <button>Submit</button>
        </form>
        <h3>Indexes I haave seen: </h3>
        {this.rendeerSeenIndexes()}

        <h3>Calculated Values: </h3>
        {this.renderValues()}
      </div>
    )
  }
}
